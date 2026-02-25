import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPT = `You are a construction materials expert helping an Australian builder create a Request for Quotation. Extract ALL material line items from this Bill of Materials.

Return ONLY a raw JSON array. No markdown, no code fences, no explanation. First character must be [

Each object must have exactly these keys:
  "name"      - product name e.g. "H2 Framing Timber 190x35"
  "sku"       - supplier SKU if visible, else ""
  "productId" - manufacturer ID if visible, else ""
  "desc"      - full description including dimensions, grade, treatment, length
  "uom"       - unit of measure inferred from context: EA, LM, m2, BAG, SHEET, ROLL etc
  "qty"       - preserve the full quantity detail exactly as written e.g. "2 @ 3.6" or "2 @ 3.6, 1 @ 4.8" — do not calculate or simplify

Respond with ONLY the JSON array starting with [`

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ items: [] })

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { items: [], error: 'File too large. Maximum size is 5MB.' },
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
      const text = buffer.toString('utf-8')
      content = `${PROMPT}\n\nDocument:\n${text}`
    }

    const message = await Promise.race([
      client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        messages: [{ role: 'user', content }],
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Parse timeout')), 30000)
      ),
    ]) as Anthropic.Message

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    const start = responseText.indexOf('[')
    const end = responseText.lastIndexOf(']')
    if (start === -1 || end === -1) return NextResponse.json({ items: [] })

    const parsed = JSON.parse(responseText.slice(start, end + 1))

    // Give every item a unique id so delete works correctly in RFQScreen
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
