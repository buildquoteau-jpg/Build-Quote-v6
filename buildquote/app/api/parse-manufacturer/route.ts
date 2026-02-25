import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { url, manufacturerName } = await req.json()

    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

    // Validate URL
    try { new URL(url) } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    const prompt = `You are a building products data extractor. Extract structured product system data from this manufacturer product page: ${url}

Return ONLY a valid JSON object with this exact structure — no markdown, no explanation, no code fences:
{
  "name": "system name",
  "application": "External Cladding|Internal Lining|Flooring|Roofing|Insulation|Structural|Decking|Screening|Fasteners|Membranes|Other",
  "thickness": "e.g. 8.5mm or null",
  "warranty": "e.g. 15 years or null",
  "description": "1-2 sentence description of the system",
  "sourceNote": "e.g. Parsed from ${manufacturerName || 'manufacturer'} product page",
  "panels": [
    { "code": "product code or empty string", "name": "product name", "dimensions": "LxWxTmm or length mm or null", "uom": "EA", "confident": true }
  ],
  "accessories": [
    { "code": "product code or empty string", "name": "accessory name", "dimensions": "length mm or null", "uom": "EA", "confident": true }
  ]
}

Rules:
- Set confident: false for any field you are uncertain about
- If you cannot extract meaningful product data, return: { "error": "Could not extract product data from this URL" }
- Do NOT invent product codes — leave as empty string if not found
- Do NOT include any pricing information
- panels = sheet/board/panel products, accessories = trims, fixings, tapes, connectors`

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content
      .map((b: any) => (b.type === 'text' ? b.text : ''))
      .join('')
      .replace(/```json|```/g, '')
      .trim()

    const result = JSON.parse(text)
    return NextResponse.json(result)

  } catch (e: any) {
    console.error('Parse error:', e)
    return NextResponse.json(
      { error: 'Could not parse this page. Try a more specific product page URL.' },
      { status: 500 }
    )
  }
}