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

    const { data, error } = await resend.emails.send({
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

    // Resend returns an error object rather than throwing — check it explicitly
    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('Email sent:', data?.id)
    return NextResponse.json({ success: true, rfqId: payload.rfqId, emailId: data?.id })

  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('Send route error:', msg)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
