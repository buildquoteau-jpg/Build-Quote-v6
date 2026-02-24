import { NextRequest, NextResponse } from 'next/server'
import { RFQPayload } from '@/lib/types'
import { generateCSVString } from '@/lib/generateCSV'

export async function POST(req: NextRequest) {
  try {
    const payload: RFQPayload = await req.json()
    const csv = generateCSVString(payload)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${payload.rfqId}.csv"`,
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to generate CSV' }, { status: 500 })
  }
}