import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import ExcelJS from 'exceljs'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const PROMPT = `You are a helpful assistant that extracts line items from any kind of list — materials lists, shopping lists, wish lists, handwritten notes, spreadsheets, or any document containing items with quantities.

Extract EVERY item you can find, no matter what type of item it is.

Rules:
- Include EVERY item, even if quantities are vague (e.g. "approx 42", "maybe 2", "a couple")
- Include items even if they are services, gift cards, cash amounts, or intangible items
- Include ALL items regardless of category — construction materials, consumer goods, food, services, anything
- Treat informal quantities as valid (e.g. "just get a box" = qty "1", "a couple" = qty "2", "heaps" = qty "10")
- If quantity is uncertain, use the higher estimate
- Skip notes, phone numbers, names, dates, and lines that are clearly not items
- Skip crossed out or cancelled items
- For cash or money items, put the amount in the qty field (e.g. qty "500", uom "dollars")
- For services (e.g. "get my nails done"), set uom to "service"
- For gift cards, set uom to "gift card"
- Correct obvious spelling mistakes when extracting (e.g. "acrilic" → "acrylic nail set")

Confidence rules — set confidence to "low" if ANY of these apply:
- Quantity is vague, estimated, or uncertain
- Item name is incomplete or unclear
- The line was hard to read or ambiguous

Return ONLY a raw JSON array. No markdown, no code fences, no explanation. First character must be [
Each object must have exactly these keys:
  "name"       - item name, cleaned up and spelled correctly e.g. "iPhone 17 Pink" or "H2 Framing Timber 190x35"
  "sku"        - supplier SKU if visible, else ""
  "productId"  - manufacturer ID if visible, else ""
  "desc"       - full description including any colour, size, spec, or details mentioned
  "uom"        - unit of measure: EA, LM, m2, BAG, SHEET, ROLL, BOX, service, gift card, dollars, etc
  "qty"        - quantity as a string, use best estimate if vague e.g. "2" or "500"
  "confidence" - "high" if item is clearly specified, "low" if uncertain in any way
Respond with ONLY the JSON array starting with [`

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_TEXT_SIZE = 100 * 1024       // 100KB for text files
const MAX_PDF_PAGES = 10               // cap pages sent to vision

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60 * 60 * 1000

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

// ---------------------------------------------------------------------------
// PDF helper — tries text extraction first, falls back to page-image vision
// ---------------------------------------------------------------------------
async function parsePDF(buffer: Buffer): Promise<OpenAI.Chat.ChatCompletionMessageParam[]> {
  try {
    // Dynamically import pdfjs-dist (avoids issues with SSR/edge bundling)
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs' as any)
    pdfjsLib.GlobalWorkerOptions.workerSrc = ''

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
    const pdfDoc = await loadingTask.promise
    const numPages = Math.min(pdfDoc.numPages, MAX_PDF_PAGES)

    // --- Attempt 1: extract text from all pages ---
    let fullText = ''
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ')
      fullText += pageText + '\n'
    }

    const trimmed = fullText.trim()

    if (trimmed.length > 50) {
      // Text PDF — send as text
      console.log(`PDF: extracted ${trimmed.length} chars of text across ${numPages} pages`)
      return [{ role: 'user', content: `${PROMPT}\n\nDocument:\n${trimmed}` }]
    }

    // --- Attempt 2: scanned PDF — render each page to canvas → base64 image ---
    console.log('PDF: no extractable text found, rendering pages as images')

    // canvas is required for pdfjs page rendering in Node
    const { createCanvas } = await import('canvas')

    const imageContent: OpenAI.Chat.ChatCompletionContentPart[] = [
      { type: 'text', text: `${PROMPT}\n\nThis is a scanned PDF. Each image below is one page. Extract all items across all pages and return a single combined JSON array.` },
    ]

    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i)
      const viewport = page.getViewport({ scale: 2.0 }) // 2x scale for legibility
      const canvas = createCanvas(viewport.width, viewport.height)
      const context = canvas.getContext('2d')

      await page.render({
        canvasContext: context as any,
        viewport,
      }).promise

      const base64 = canvas.toDataURL('image/png').split(',')[1]
      imageContent.push({
        type: 'image_url',
        image_url: { url: `data:image/png;base64,${base64}` },
      })
    }

    return [{ role: 'user', content: imageContent }]

  } catch (err) {
    console.error('PDF parse error:', err)
    // Last resort: try raw text
    const text = buffer.toString('utf-8')
    return [{ role: 'user', content: `${PROMPT}\n\nDocument:\n${text}` }]
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
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

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { items: [], error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { items: [], error: 'File type not supported.' },
        { status: 400 }
      )
    }

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

    let messages: OpenAI.Chat.ChatCompletionMessageParam[]

    if (isImage) {
      messages = [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${file.type};base64,${base64}` },
            },
            { type: 'text', text: PROMPT },
          ],
        },
      ]
    } else if (isPDF) {
      messages = await parsePDF(buffer)
    } else if (['.xlsx', '.xls'].includes(ext)) {
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(buffer as any)
      const csvSheets: string[] = []
      workbook.eachSheet((sheet) => {
        const rows: string[] = []
        sheet.eachRow((row) => {
          const values = (row.values as ExcelJS.CellValue[]).slice(1)
          rows.push(values.map(v => (v === null || v === undefined ? '' : String(v))).join(','))
        })
        csvSheets.push(`Sheet: ${sheet.name}\n${rows.join('\n')}`)
      })
      const csvText = csvSheets.join('\n\n')
      if (csvText.length > MAX_TEXT_SIZE) {
        return NextResponse.json(
          { items: [], error: 'Spreadsheet too large. Please reduce the number of rows.' },
          { status: 400 }
        )
      }
      messages = [{ role: 'user', content: `${PROMPT}\n\nSpreadsheet data (CSV format):\n${csvText}` }]
    } else {
      if (file.size > MAX_TEXT_SIZE) {
        return NextResponse.json(
          { items: [], error: 'Text file too large. Maximum size is 100KB.' },
          { status: 400 }
        )
      }
      const text = buffer.toString('utf-8')
      messages = [{ role: 'user', content: `${PROMPT}\n\nDocument:\n${text}` }]
    }

    const completion = await Promise.race([
      client.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 4096,
        messages,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Parse timeout')), 55000)
      ),
    ]) as OpenAI.Chat.ChatCompletion

    const responseText = completion.choices[0]?.message?.content ?? ''

    const start = responseText.indexOf('[')
    const end = responseText.lastIndexOf(']')

    let items: any[] = []

    if (start !== -1 && end !== -1) {
      try {
        items = JSON.parse(responseText.slice(start, end + 1))
      } catch {
        console.warn('Full JSON parse failed, attempting object-by-object recovery')
        const chunk = responseText.slice(start, end + 1)
        const objMatches = chunk.match(/\{[^{}]+\}/g) || []
        for (const obj of objMatches) {
          try {
            const parsed = JSON.parse(obj)
            if (parsed.name) items.push(parsed)
          } catch {
            // skip malformed object
          }
        }
      }
    }

    const result = items
      .filter((item: any) => item && typeof item.name === 'string' && item.name.trim() !== '')
      .map((item: any) => ({
        id: randomUUID(),
        name: item.name || '',
        sku: item.sku || '',
        productId: item.productId || '',
        desc: item.desc || '',
        uom: item.uom || '',
        qty: item.qty ? String(item.qty) : '',
        confidence: item.confidence === 'low' ? 'low' : 'high',
      }))

    return NextResponse.json({ items: result })

  } catch (e) {
    console.error('Parse error:', e)
    return NextResponse.json({ items: [], error: 'Failed to parse file' }, { status: 500 })
  }
}
