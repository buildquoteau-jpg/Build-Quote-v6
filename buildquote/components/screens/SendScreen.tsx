'use client'
import { useState, useRef, useEffect } from 'react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import CheckRow from '../ui/CheckRow'
import SectionLabel from '../ui/SectionLabel'
import Toggle from '../ui/Toggle'
import { BuilderDetails, SupplierDetails, RFQPayload } from '@/lib/types'
import { SUPPLIERS, SupplierEntry } from '@/lib/suppliers'

interface SendScreenProps {
  rfqPayload: Omit<RFQPayload, 'rfqId'>
  onChange: (payload: Omit<RFQPayload, 'rfqId'>) => void
  onBack: () => void
  onSend: () => void
  sending: boolean
  sendError?: string
}

function validatePhone(v: string) {
  if (!v) return ''
  const digits = v.replace(/\D/g, '')
  if (digits.length < 8) return 'Phone number seems too short'
  return ''
}

function validateEmail(v: string) {
  if (!v) return ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address'
  return ''
}


export default function SendScreen({ rfqPayload, onChange, onBack, onSend, sending, sendError }: SendScreenProps) {
  const [supplierQuery, setSupplierQuery] = useState(rfqPayload.supplier.supplierName)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedFromList, setSelectedFromList] = useState(false)
  const supplierInputRef = useRef<HTMLDivElement>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [termsConfirmed, setTermsConfirmed] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState('')

  const phoneError = validatePhone(rfqPayload.builder.phone)
  const builderEmailError = validateEmail(rfqPayload.builder.email)

  const filteredSuppliers = supplierQuery.trim().length >= 2 && !selectedFromList
    ? SUPPLIERS.filter(s => !s.hidden && s.name.toLowerCase().includes(supplierQuery.toLowerCase())).slice(0, 6)
    : []

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (supplierInputRef.current && !supplierInputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [previewUrl])

  const selectSupplier = (s: SupplierEntry) => {
    setSupplierQuery(s.name)
    setSelectedFromList(true)
    setShowSuggestions(false)
    // If sandbox supplier, autofill supplier email with builder's own email
    const supplierEmail = s.sandbox ? rfqPayload.builder.email : s.email
    onChange({ ...rfqPayload, supplier: { supplierName: s.name, supplierEmail, accountNumber: rfqPayload.supplier.accountNumber } })
  }

  const handleSupplierNameChange = (val: string) => {
    setSupplierQuery(val)
    setSelectedFromList(false)
    setShowSuggestions(true)
    onChange({ ...rfqPayload, supplier: { ...rfqPayload.supplier, supplierName: val } })
  }

  const setBuilder = (field: keyof BuilderDetails, value: string) =>
    onChange({ ...rfqPayload, builder: { ...rfqPayload.builder, [field]: value } })

  const setSupplier = (field: keyof SupplierDetails, value: string) =>
    onChange({ ...rfqPayload, supplier: { ...rfqPayload.supplier, [field]: value } })

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setPreviewError('')
  }

  const handlePreview = async () => {
    setPreviewLoading(true)
    setPreviewError('')
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rfqPayload, rfqId: 'PREVIEW' }),
      })
      if (!res.ok) throw new Error('PDF generation failed')
      const blob = await res.blob()
      setPreviewUrl(URL.createObjectURL(blob))
    } catch {
      setPreviewError('Could not generate preview. Try again.')
    } finally {
      setPreviewLoading(false)
    }
  }

  // Check if sandbox supplier is selected — keep email in sync with builder email
  const today = new Date().toISOString().split('T')[0]
  const isSandbox = SUPPLIERS.some(s => s.sandbox && s.name === rfqPayload.supplier.supplierName)

  return (
    <>
      {/* PDF Preview Overlay — mobile optimised */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ui-darkest">
          <div className="flex items-center justify-between px-4 py-3 bg-ui-darker border-b border-border shrink-0">
            <div className="min-w-0 flex-1">
              <p className="text-text-primary text-sm font-semibold truncate">RFQ Preview</p>
              <p className="text-text-muted text-xs mt-0.5">Review before sending</p>
            </div>
            <button onClick={closePreview} className="text-text-muted hover:text-text-primary text-2xl leading-none px-2 shrink-0">✕</button>
          </div>
          <div className="flex-1 overflow-auto" style={{ WebkitOverflowScrolling: "touch", maxWidth: "100vw" }}>
            <iframe src={previewUrl} className="w-full border-0" title="RFQ Preview" style={{ minHeight: '100vh', width: '100%', maxWidth: '100vw', display: 'block' }} />
          </div>
          <div className="flex gap-3 px-4 py-4 bg-ui-darker border-t border-border shrink-0">
            <button onClick={closePreview} className="flex-1 py-3 rounded-xl border border-border-subtle text-text-secondary font-medium text-sm hover:bg-surface transition-colors">
              ← Edit
            </button>
            <button
              onClick={() => { closePreview(); setShowConfirm(true) }}
              disabled={sending || !rfqPayload.supplier.supplierEmail || !rfqPayload.builder.email}
              className="flex-1 py-3 rounded-xl bg-brand hover:bg-brand-hover disabled:opacity-40 text-text-primary font-semibold text-sm transition-colors"
            >
              {sending ? 'Sending...' : 'Send RFQ →'}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full overflow-hidden">
        <Card className="flex flex-col gap-3 w-full overflow-hidden">
          <SectionLabel>Your Details</SectionLabel>
          <Input label="Builder Name" value={rfqPayload.builder.builderName} onChange={v => setBuilder('builderName', v)} />
          <Input label="Company Name" value={rfqPayload.builder.company} onChange={v => setBuilder('company', v)} />
          <Input label="ABN / ACN" value={rfqPayload.builder.abn} onChange={v => setBuilder('abn', v)} />
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label className="text-xs text-text-muted font-medium uppercase tracking-wide">Phone</label>
              <input
                type="tel"
                value={rfqPayload.builder.phone}
                onChange={e => setBuilder('phone', e.target.value)}
                className="bg-ui border border-border-subtle rounded-lg px-3 py-2 text-text-primary placeholder-text-disabled focus:outline-none focus:border-brand transition-colors w-full max-w-full box-border text-sm"
              />
              {phoneError && <p className="text-error text-xs">{phoneError}</p>}
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label className="text-xs text-text-muted font-medium uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={rfqPayload.builder.email}
                onChange={e => setBuilder('email', e.target.value)}
                className="bg-ui border border-border-subtle rounded-lg px-3 py-2 text-text-primary placeholder-text-disabled focus:outline-none focus:border-brand transition-colors w-full max-w-full box-border text-sm"
              />
              {builderEmailError && <p className="text-error text-xs">{builderEmailError}</p>}
            </div>
          </div>
        </Card>

        <Card className="flex flex-col gap-3 w-full overflow-hidden">
          <SectionLabel>Supplier Details</SectionLabel>
          <div className="relative" ref={supplierInputRef}>
            <label className="text-text-muted text-xs uppercase tracking-widest block mb-1">Supplier Name</label>
            <input
              value={supplierQuery}
              onChange={e => handleSupplierNameChange(e.target.value)}
              onFocus={() => { if (!selectedFromList && supplierQuery.length >= 2) setShowSuggestions(true) }}
              placeholder="Start typing a supplier name..."
              className="bg-ui border border-border-subtle rounded-lg px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand w-full max-w-full box-border text-sm"
            />
            {showSuggestions && filteredSuppliers.length > 0 && (
              <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-ui-dark border border-border-subtle rounded-lg overflow-hidden shadow-xl max-h-64 overflow-y-auto">
                {filteredSuppliers.map(s => (
                  <button key={s.name} onMouseDown={e => { e.preventDefault(); selectSupplier(s) }}
                    className="w-full text-left px-4 py-3 hover:bg-ui border-b border-border last:border-0 transition-colors">
                    <p className="text-text-primary text-sm font-medium">{s.name}</p>
                    <p className="text-text-faint text-xs mt-0.5">
                      {s.sandbox ? 'Sends RFQ to your own email for testing' : `${s.email}${s.phone ? ' · ' + s.phone : ''}`}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
          {isSandbox && (
            <div className="bg-brand-subtle border border-brand/20 rounded-lg px-3 py-2">
              <p className="text-brand text-xs font-medium">Sandbox mode — RFQ will be sent to your own email address</p>
            </div>
          )}
          <Input label="Supplier Email" value={rfqPayload.supplier.supplierEmail} onChange={v => setSupplier('supplierEmail', v)} type="email" />
          <div className="flex flex-col gap-1">
            <label className="text-text-muted text-xs uppercase tracking-widest block">Account Number</label>
            <input
              value={rfqPayload.supplier.accountNumber}
              onChange={e => setSupplier('accountNumber', e.target.value)}
              placeholder="Your trade account number if known"
              className="bg-ui border border-border-subtle rounded-lg px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand w-full max-w-full box-border text-sm"
            />
          </div>
        </Card>

        <Card className="flex flex-col gap-3 w-full overflow-hidden">
          <SectionLabel>Project Reference</SectionLabel>
          <Input
            label="Project Reference"
            value={rfqPayload.projectReference || ''}
            onChange={v => onChange({ ...rfqPayload, projectReference: v })}
            placeholder="e.g. Smith Residence — Wall Framing Stage"
          />
        </Card>

        <Card className="flex flex-col gap-3 w-full overflow-hidden">
          <SectionLabel>Delivery</SectionLabel>
          <Toggle value={rfqPayload.delivery} onChange={v => onChange({ ...rfqPayload, delivery: v })} />
          {rfqPayload.delivery === 'delivery' && (
            <>
              <Input label="Street Address" value={rfqPayload.siteAddress || ''} onChange={v => onChange({ ...rfqPayload, siteAddress: v })} placeholder="e.g. 14 Karrinyup Road" />
              <Input label="Suburb" value={(rfqPayload as any).siteSuburb || ''} onChange={v => onChange({ ...rfqPayload, siteSuburb: v } as any)} placeholder="e.g. Dunsborough" />
            </>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-text-muted text-xs uppercase tracking-widest block">Date Required</label>
            <input
              type="date"
              min={today}
              value={rfqPayload.dateRequired}
              onChange={e => { const v = e.target.value; if (v >= today) onChange({ ...rfqPayload, dateRequired: v }) }}
              className="bg-ui border border-border-subtle rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand w-full max-w-full box-border text-sm"
            />
            <p className="text-text-faint text-xs mt-1">Approximate date these goods will be required on site</p>
          </div>
        </Card>

        <Card className="flex flex-col gap-3 w-full overflow-hidden">
          <SectionLabel>Message</SectionLabel>
          <textarea
            value={rfqPayload.message}
            onChange={e => onChange({ ...rfqPayload, message: e.target.value })}
            placeholder="Any additional notes for the supplier..."
            rows={4}
            className="bg-ui border border-border-subtle rounded-lg px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand w-full max-w-full box-border resize-none text-sm"
          />
        </Card>

        <Card className="flex flex-col gap-1 w-full overflow-hidden">
          <SectionLabel>Send Options</SectionLabel>
          <CheckRow label="Send RFQ to Supplier" checked={rfqPayload.sendToSupplier !== false} onChange={v => onChange({ ...rfqPayload, sendToSupplier: v })} />
          {!rfqPayload.sendToSupplier && (
            <p className="text-text-faint text-xs ml-7 -mt-1 mb-1">PDF will be generated without emailing the supplier</p>
          )}
          <CheckRow label="Send a copy to myself" checked={rfqPayload.sendCopyToSelf} onChange={v => onChange({ ...rfqPayload, sendCopyToSelf: v })} />
        </Card>

        {sendError && (
          <div className="bg-error-bg border border-error-border rounded-lg px-4 py-3 text-error text-sm">⚠️ {sendError}</div>
        )}
        {previewError && (
          <div className="bg-error-bg border border-error-border rounded-lg px-4 py-3 text-error text-sm">⚠️ {previewError}</div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack} className="flex-1 py-3">← Back</Button>
          <button onClick={handlePreview} disabled={previewLoading}
            className="flex-1 py-3 rounded-xl border border-brand text-brand hover:bg-brand-subtle disabled:opacity-50 font-medium text-sm transition-colors">
            {previewLoading ? 'Loading...' : '👁 Preview'}
          </button>
          <Button onClick={() => setShowConfirm(true)} disabled={sending || !rfqPayload.supplier.supplierEmail || !rfqPayload.builder.email} className="flex-1 py-3">
            {sending ? 'Sending...' : 'Send →'}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-page/80 px-4 pb-4 sm:pb-0">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-5 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div>
              <h2 className="text-text-primary font-bold text-lg">Send request to supplier</h2>
            </div>
            <div className="bg-ui-dark/60 rounded-xl p-3 border border-border">
              <p className="text-text-muted text-xs mb-1">You are sending this quote request to:</p>
              <p className="text-brand text-sm font-bold break-words">
                {rfqPayload.supplier.supplierName || 'Selected Supplier'}
              </p>
              {rfqPayload.supplier.supplierEmail && (
                <p className="text-text-muted text-xs mt-0.5 break-all">{rfqPayload.supplier.supplierEmail}</p>
              )}
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">
              This request contains the materials and quantities you have reviewed and approved. Product specifications, pack sizes, availability and pricing may vary between suppliers. Please confirm all product details and suitability directly with the supplier before placing an order. Any updates or changes should be communicated directly between you and your preferred supplier.
            </p>
            <p className="text-text-faint text-xs leading-relaxed">
              BuildQuote provides a tool for creating and sending quote requests. BuildQuote does not verify product specifications, availability, pricing or suitability for your project.
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsConfirmed}
                onChange={e => setTermsConfirmed(e.target.checked)}
                className="mt-0.5 accent-brand shrink-0"
              />
              <span className="text-text-secondary text-xs leading-relaxed">
                I understand that I must confirm all materials and specifications directly with the supplier.
              </span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowConfirm(false); setTermsConfirmed(false) }}
                className="flex-1 bg-ui hover:bg-ui-hover text-text-primary text-sm font-medium py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowConfirm(false); onSend() }}
                disabled={!termsConfirmed || sending}
                className="flex-1 bg-brand hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed text-text-primary text-sm font-bold py-3 rounded-xl transition-colors"
              >
                {sending ? 'Sending...' : 'Send Quote Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
