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
    <div className="w-full px-4 py-5 sm:py-8">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <div className="rounded-2xl border border-border bg-surface px-5 py-6 text-center shadow-sm">
          <div className="text-4xl leading-none sm:text-5xl">✅</div>

          <h1 className="mt-3 text-3xl font-bold leading-tight text-text-primary">
            RFQ Sent
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-relaxed text-text-secondary sm:text-base">
            Your quote request has been sent to {payload.supplier.supplierName}.
          </p>

          <div className="mt-5 rounded-xl bg-surface-subtle px-4 py-4 text-left">
            <SectionLabel>RFQ Reference</SectionLabel>
            <p className="mt-2 break-all font-mono text-2xl font-bold tracking-tight text-brand">
              {rfqId}
            </p>
          </div>
        </div>

        <Card className="w-full py-4">
          <SectionLabel>Downloads</SectionLabel>
          <div className="mt-3 grid gap-3">
            <Button
              variant="secondary"
              onClick={() => download('pdf')}
              className="w-full py-3"
            >
              ⬇ Download PDF
            </Button>
            <Button
              variant="secondary"
              onClick={() => download('csv')}
              className="w-full py-3"
            >
              ⬇ Download CSV
            </Button>
          </div>
        </Card>

        <Button
          onClick={onReset}
          className="w-full py-3 text-white"
        >
          + Start Another RFQ
        </Button>

        <div className="flex w-full gap-3 rounded-xl border border-border bg-ui-darker p-4 text-left">
          <span className="mt-0.5 shrink-0 text-sm text-warning">⚠</span>
          <p className="text-sm font-medium leading-relaxed text-text-secondary">
            BuildQuote does not track builder to supplier requests for quotation.
            Please contact your preferred supplier to confirm receipt and product availability.
          </p>
        </div>

        <div className="w-full rounded-xl border border-brand/30 bg-ui-darker p-4 text-left">
          <p className="text-base font-semibold text-text-primary">
            More features coming to BuildQuote soon.
          </p>
          <p className="mt-1 text-sm font-medium leading-relaxed text-text-secondary">
            Supplier directory, saved builder profiles, component libraries and more — built for Southwest WA builders.
          </p>

          <div className="mt-3">
            {joined ? (
              <p className="text-sm font-medium text-brand">
                ✓ You&apos;re in — we&apos;ll keep you posted.
              </p>
            ) : (
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={joined}
                  onChange={handleCommunitySignup}
                  disabled={joining || !payload.builder.email}
                  className="mt-0.5 shrink-0 accent-brand"
                />
                <span className="text-sm leading-relaxed text-text-primary">
                  {joining ? 'Signing you up...' : 'Keep me in the loop — join the BuildQuote community'}
                </span>
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
