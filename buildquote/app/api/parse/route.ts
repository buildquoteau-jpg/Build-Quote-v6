import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPT = `Extract all line items from this materials list or bill of materials. Return a JSON array only, no other text. Each item should have: id, name, sku, productId, desc, uom, qty. If a field is unknown leave it as empty string. For qty, preserve the full quantity detail exactly as written — for example "2 @ 3.6" or "2 @ 3.6, 1 @ 4.8" — do not calculate or simplify. Example: [{"id":"1","name":"H2 Framing Timber 190x35","sku":"","productId":"","desc":"H2 treated pine 190x35","uom":"LM","qty":"2 @ 3.6"}]`

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ items: [] })

// Guardrails
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
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

    if (isImage || isPDF) {
      content = [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
            data: base64,
          },
        },
        {
          type: 'text',
          text: PROMPT,
        },
      ]
    } else {
      const text = buffer.toString('utf-8')
      content = `${PROMPT}\n\n${text}`
    }

   const message = await Promise.race([
  client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content }],
  }),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Parse timeout')), 30000)
  ),
]) as Anthropic.Message

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return NextResponse.json({ items: [] })

    const items = JSON.parse(jsonMatch[0])
    return NextResponse.json({ items })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ items: [] }, { status: 500 })
  }
}