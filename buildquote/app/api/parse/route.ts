import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPT = `You are a construction materials expert helping an Australian builder create a Request for Quotation. Extract ALL material line items from this Bill of Materials.

Rules:
- Include EVERY orderable item, even if quantities are vague (e.g. "approx 42", "maybe 2")
- Include items marked "supply only" or "install separate" — they are still orderable materials
- Include ALL fixings, hardware, bolts, screws, anchors, hangers — even if described casually
- Include windows, doors, and openings — even if installer is separate
- Skip notes, phone numbers, names, dates, and non-material lines
- Skip crossed out or cancelled items
- If quantity is uncertain, use the higher estimate
- Treat informal quantities as valid (e.g. "just get a box" = qty "1", "a couple" = qty "2")

Confidence rules — set confidence to "low" if ANY of these apply:
- Quantity is vague, estimated, or uncertain
- Product name is incomplete or uses "or similar" / "or equivalent"
- Dimensions or grade are missing
- Item uses informal language

Return ONLY a raw JSON array. No markdown, no code fences, no explanation. First character must be [
Each object must have exactly these keys:
  "name"       - product name e.g. "H2 Framing Timber 190x35"
  "sku"        - supplier SKU if visible, else ""
  "productId"  - manufacturer ID if visible, else ""
  "desc"       - full description including dimensions, grade, treatment, length
  "uom"        - unit of measure inferred from context: EA, LM, m2, BAG, SHEET, ROLL, BOX etc
  "qty"        - quantity as a string, use best estimate if vague e.g. "42" or "85"
  "confidence" - "high" if item is clearly specified, "low" if uncertain in any way
Respond with ONLY the JSON array starting with [`

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_TEXT_SIZE = 100 * 1024       // 100KB for text files

// Simple in-memory rate limiter — 10 requests per hour per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.csv', '.txt', '.xls', '.xlsx', '.doc', '.docx']
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/csv', 'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { items: [], error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ items: [] })

    // File size check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { items: [], error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // MIME type check
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { items: [], error: 'File type not supported.' },
        { status: 400 }
      )
    }

    // File extension check
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { items: [], error: 'File extension not supported.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    const isImage = file.type.startsWith('image/')
    const isPDF = file.type === 'application/pdf'

    let content: Anthropic.MessageParam['content']

    if (isImage) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const mediaType = validImageTypes.includes(file.type)
        ? (file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp')
        : 'image/jpeg'

      content = [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        },
        { type: 'text', text: PROMPT },
      ]
    } else if (isPDF) {
      content = [
        {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: base64 },
        },
        { type: 'text', text: PROMPT },
      ]
    } else {
      // Text-based files — enforce size limit
      if (file.size > MAX_TEXT_SIZE) {
        return NextResponse.json(
          { items: [], error: 'Text file too large. Maximum size is 100KB.' },
          { status: 400 }
        )
      }
      const text = buffer.toString('utf-8')
      content = `${PROMPT}\n\nDocument:\n${text}`
    }

    const message = await Promise.race([
      client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        messages: [{ role: 'user', content }],
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Parse timeout')), 60000)
      ),
    ]) as Anthropic.Message

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    const start = responseText.indexOf('[')
    const end = responseText.lastIndexOf(']')
    if (start === -1 || end === -1) return NextResponse.json({ items: [] })

    const parsed = JSON.parse(responseText.slice(start, end + 1))

    const items = parsed.map((item: any) => ({
      id: randomUUID(),
      ...item,
    }))

    return NextResponse.json({ items })

  } catch (e) {
    console.error('Parse error:', e)
    return NextResponse.json({ items: [], error: 'Failed to parse file' }, { status: 500 })
  }
}
