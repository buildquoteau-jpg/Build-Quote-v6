import { NextRequest, NextResponse } from 'next/server'
import { put, head } from '@vercel/blob'

export async function POST(req: NextRequest) {
  try {
    const { manufacturerSlug, system } = await req.json()
    if (!manufacturerSlug || !system?.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    let existing: any[] = []
    try {
      const blob = await head('user-systems.json')
      if (blob) {
        const text = await fetch(blob.url).then(r => r.text())
        existing = JSON.parse(text)
      }
    } catch {}
    const newSystem = {
      ...system,
      slug: system.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      manufacturerSlug,
      communityAdded: true,
      addedAt: new Date().toISOString(),
    }
    existing.push(newSystem)
    await put('user-systems.json', JSON.stringify(existing, null, 2), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    })
    return NextResponse.json({ success: true, system: newSystem })
  } catch (e: any) {
    console.error('Save error:', e)
    return NextResponse.json({ error: 'Failed to save system' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const blob = await head('user-systems.json')
    if (!blob) return NextResponse.json([])
    const text = await fetch(blob.url).then(r => r.text())
    return NextResponse.json(JSON.parse(text))
  } catch {
    return NextResponse.json([])
  }
}
