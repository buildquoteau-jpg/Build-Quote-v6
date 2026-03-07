'use client'
import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import SectionLabel from '../ui/SectionLabel'
import { RFQPayload } from '@/lib/types'

interface SuccessScreenProps {
  rfqId: string
  payload: RFQPayload
  onReset: () => void
}

export default function SuccessScreen({ rfqId, payload, onReset }: SuccessScreenProps) {
  const download = async (type: 'pdf' | 'csv') => {
    const res = await fetch(`/api/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${rfqId}.${type}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const [joined, setJoined] = useState(false)
  const [joining, setJoining] = useState(false)

  const handleCommunitySignup = async () => {
    if (!payload.builder.email || joined || joining) return
    setJoining(true)
    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: payload.builder.email, rfqId }),
      })
      setJoined(true)
    } catch {
      // fail silently
    } finally {
      setJoining(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center text-center">
      <div className="text-6xl mt-4">✅</div>
      <h1 className="text-3xl font-bold text-text-primary">RFQ Sent!</h1>
      <p className="text-text-muted">Your quote request has been sent to {payload.supplier.supplierName}.</p>

      <Card className="w-full text-left">
        <SectionLabel>RFQ Reference</SectionLabel>
        <p className="text-brand font-mono text-xl font-bold">{rfqId}</p>
      </Card>

      <Card className="w-full flex flex-col gap-3">
        <SectionLabel>Downloads</SectionLabel>
        <Button variant="secondary" onClick={() => download('pdf')} className="w-full py-3">
          ⬇ Download PDF
        </Button>
        <Button variant="secondary" onClick={() => download('csv')} className="w-full py-3">
          ⬇ Download CSV
        </Button>
      </Card>

      <Button onClick={onReset} className="w-full py-3">
        + Start Another RFQ
      </Button>

      <div className="w-full flex gap-3 items-start bg-ui-darker border border-border rounded-lg p-4 text-left">
        <span className="text-warning text-sm mt-0.5 flex-shrink-0">⚠</span>
        <p className="text-text-muted text-xs leading-relaxed">
          BuildQuote does not track builder to supplier Requests for Quotation. Please call your preferred supplier to confirm receipt and product availability.
        </p>
      </div>

      <div className="w-full bg-ui-darker border border-brand/30 rounded-xl p-4 text-left flex flex-col gap-3">
        <p className="text-text-primary text-sm font-semibold">More features coming to BuildQuote soon.</p>
        <p className="text-text-muted text-xs leading-relaxed">Supplier directory, saved builder profiles, component libraries and more — built for Southwest WA builders.</p>
        {joined ? (
          <p className="text-brand text-xs font-medium">✓ You&apos;re in — we&apos;ll keep you posted.</p>
        ) : (
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={joined}
              onChange={handleCommunitySignup}
              disabled={joining || !payload.builder.email}
              className="mt-0.5 accent-brand shrink-0"
            />
            <span className="text-text-secondary text-xs leading-relaxed">
              {joining ? 'Signing you up...' : 'Keep me in the loop — join the BuildQuote community'}
            </span>
          </label>
        )}
      </div>
    </div>
  )
}
