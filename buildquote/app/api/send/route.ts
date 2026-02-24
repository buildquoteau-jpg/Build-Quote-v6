import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { RFQPayload } from '@/lib/types'
import { buildEmailHtml } from '@/lib/emailTemplate'
import { generatePDFBuffer } from '@/lib/generatePDF'
import { generateCSVString } from '@/lib/generateCSV'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const payload: RFQPayload = await req.json()

    const html = buildEmailHtml(payload)
    const pdfBuffer = await generatePDFBuffer(payload)
    const csvString = generateCSVString(payload)

    const to = [payload.supplier.supplierEmail]
    const cc = payload.sendCopyToSelf ? [payload.builder.email] : []

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'rfq@buildquote.com.au',
      to,
      cc,
      replyTo: payload.builder.email,
      subject: `RFQ from ${payload.builder.builderName} — ${payload.builder.company} — ${payload.rfqId}`,
      html,
      attachments: [
        {
          filename: `${payload.rfqId}.pdf`,
          content: pdfBuffer,
        },
        {
          filename: `${payload.rfqId}.csv`,
          content: Buffer.from(csvString),
        },
      ],
    })

    return NextResponse.json({ success: true, rfqId: payload.rfqId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
