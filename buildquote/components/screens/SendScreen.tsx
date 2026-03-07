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

const today = new Date().toISOString().split('T')[0]

export default function SendScreen({ rfqPayload, onChange, onBack, onSend, sending, sendError }: SendScreenProps) {
  const [listening, setListening] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  const [liveTranscript, setLiveTranscript] = useState('')
  const recognitionRef = useRef<any>(null)
  const committedRef = useRef<string>('')
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
    ? SUPPLIERS.filter(s => s.name.toLowerCase().includes(supplierQuery.toLowerCase())).slice(0, 6)
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
    onChange({ ...rfqPayload, supplier: { supplierName: s.name, supplierEmail: s.email, accountNumber: rfqPayload.supplier.accountNumber } })
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

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      setLiveTranscript('')
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) { setVoiceError('Voice input not supported in this browser.'); return }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-AU'
    committedRef.current = rfqPayload.message
    recognition.onresult = (e: any) => {
      let interim = ''
      let newCommitted = committedRef.current
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) { newCommitted += e.results[i][0].transcript + ' '; committedRef.current = newCommitted }
        else interim = e.results[i][0].transcript
      }
      setLiveTranscript(interim)
      onChange({ ...rfqPayload, message: newCommitted + interim })
    }
    recognition.onerror = (e: any) => {
      if (e.error === 'not-allowed') setVoiceError('Microphone access denied. Check browser settings.')
      else if (e.error !== 'aborted') setVoiceError('Voice error: ' + e.error)
      setListening(false)
      setLiveTranscript('')
    }
    recognition.onend = () => { setListening(false); setLiveTranscript('') }
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  return (
    <>
      {/* PDF Preview Overlay */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ui-darkest">
          <div className="flex items-center justify-between px-4 py-3 bg-ui-darker border-b border-border shrink-0">
            <div>
              <p className="text-text-primary text-sm font-semibold">RFQ Preview</p>
              <p className="text-text-muted text-xs mt-0.5">Review before sending</p>
            </div>
            <button onClick={closePreview} className="text-text-muted hover:text-text-primary text-2xl leading-none px-2">✕</button>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe src={previewUrl} className="w-full h-full border-0" title="RFQ Preview" style={{ maxWidth: '100%', display: 'block' }} />
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

      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-3">
          <SectionLabel>Your Details</SectionLabel>
          <Input label="Builder Name" value={rfqPayload.builder.builderName} onChange={v => setBuilder('builderName', v)} />
          <Input label="Company Name" value={rfqPayload.builder.company} onChange={v => setBuilder('company', v)} />
          <Input label="ABN / ACN" value={rfqPayload.builder.abn} onChange={v => setBuilder('abn', v)} />
          <div className="flex gap-3">
            <Input label="Phone" value={rfqPayload.builder.phone} onChange={v => setBuilder('phone', v)} type="tel" className="flex-1" />
            {phoneError && <p className="text-error text-xs mt-1">{phoneError}</p>}
            <Input label="Email" value={rfqPayload.builder.email} onChange={v => setBuilder('email', v)} type="email" className="flex-1" />
            {builderEmailError && <p className="text-error text-xs mt-1">{builderEmailError}</p>}
          </div>
        </Card>

        <Card className="flex flex-col gap-3">
          <SectionLabel>Supplier Details</SectionLabel>
          <div className="relative" ref={supplierInputRef}>
            <label className="text-text-muted text-xs uppercase tracking-widest block mb-1">Supplier Name</label>
            <input
              value={supplierQuery}
              onChange={e => handleSupplierNameChange(e.target.value)}
              onFocus={() => { if (!selectedFromList && supplierQuery.length >= 2) setShowSuggestions(true) }}
              placeholder="Start typing a supplier name..."
              className="bg-ui border border-border-subtle rounded-lg px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand w-full text-sm"
            />
            {showSuggestions && filteredSuppliers.length > 0 && (
              <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-ui-dark border border-border-subtle rounded-lg overflow-hidden shadow-xl">
                {filteredSuppliers.map(s => (
                  <button key={s.name} onMouseDown={e => { e.preventDefault(); selectSupplier(s) }}
                    className="w-full text-left px-4 py-3 hover:bg-ui border-b border-border last:border-0 transition-colors">
                    <p className="text-text-primary text-sm font-medium">{s.name}</p>
                    <p className="text-text-faint text-xs mt-0.5">{s.email}{s.phone ? ' · ' + s.phone : ''}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Input label="Supplier Email" value={rfqPayload.supplier.supplierEmail} onChange={v => setSupplier('supplierEmail', v)} type="email" />
          <div>
            <label className="text-text-muted text-xs uppercase tracking-widest block mb-1">Account Number</label>
            <input
              value={rfqPayload.supplier.accountNumber}
              onChange={e => setSupplier('accountNumber', e.target.value)}
              placeholder="Your trade account number with this supplier if known"
              className="bg-ui border border-border-subtle rounded-lg px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand w-full text-sm"
            />
          </div>
        </Card>

        <Card className="flex flex-col gap-3">
          <SectionLabel>Project Reference</SectionLabel>
          <Input
            label="Project Reference"
            value={rfqPayload.projectReference || ''}
            onChange={v => onChange({ ...rfqPayload, projectReference: v })}
            placeholder="e.g. Smith Residence — Waff Framing Stage"
          />
          <div className="flex items-start gap-2 mt-1">
            <input
              type="checkbox"
              id="sendToSupplier"
              checked={rfqPayload.sendToSupplier !== false}
              onChange={e => onChange({ ...rfqPayload, sendToSupplier: e.target.checked })}
              className="mt-0.5 accent-brand"
            />
            <label htmlFor="sendToSupplier" className="text-text-secondary text-xs leading-relaxed cursor-pointer">
              Send this RFQ to supplier<br />
              <span className="text-text-faint">Untick to generate the PDF only without emailing the supplier</span>
            </label>
          </div>
        </Card>

        <Card className="flex flex-col gap-3">
          <SectionLabel>Delivery</SectionLabel>
          <Toggle value={rfqPayload.delivery} onChange={v => onChange({ ...rfqPayload, delivery: v })} />
          {rfqPayload.delivery === 'delivery' && (
            <>
              <Input label="Street Address" value={rfqPayload.siteAddress || ''} onChange={v => onChange({ ...rfqPayload, siteAddress: v })} placeholder="e.g. 14 Karrinyup Road" />
              <Input label="Suburb" value={(rfqPayload as any).siteSuburb || ''} onChange={v => onChange({ ...rfqPayload, siteSuburb: v } as any)} placeholder="e.g. Dunsborough" />
            </>
          )}
          <div>
            <label className="text-text-muted text-xs uppercase tracking-widest block mb-1">Date Required</label>
            <input
              type="date"
              min={today}
              value={rfqPayload.dateRequired}
              onChange={e => onChange({ ...rfqPayload, dateRequired: e.target.value })}
              className="bg-ui border border-border-subtle rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-brand w-full max-w-full text-sm box-border"
            />
            <p className="text-text-faint text-xs mt-1">Approximate date these goods will be required on site</p>
          </div>
        </Card>

        <Card className="flex flex-col gap-3">
          <SectionLabel>Message</SectionLabel>
          {!listening && (
            <div className="bg-ui/50 border border-border-subtle rounded-lg px-3 py-2.5 flex items-center gap-3">
              <span className="text-2xl">🎤</span>
              <div className="flex-1">
                <p className="text-text-secondary text-xs font-medium">Tap the mic to dictate your message</p>
                <p className="text-text-faint text-xs mt-0.5">Speak naturally — your words will appear in real time</p>
              </div>
              <button type="button" onClick={toggleVoice} className="bg-ui-hover hover:bg-brand text-text-primary text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                Start
              </button>
            </div>
          )}
          {listening && (
            <div className="bg-error-bg border border-error-border rounded-lg px-3 py-2.5 flex items-center gap-3">
              <span className="text-error text-xl animate-pulse">🔴</span>
              <div className="flex-1">
                <p className="text-error text-xs font-medium animate-pulse">Listening... speak now</p>
                {liveTranscript && <p className="text-brand text-xs mt-0.5 italic">&ldquo;{liveTranscript}&rdquo;</p>}
              </div>
              <button type="button" onClick={toggleVoice} className="bg-error-bg hover:bg-error/20 text-error text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                Stop
              </button>
            </div>
          )}
          <div className="relative">
            <textarea
              value={rfqPayload.message}
              onChange={e => onChange({ ...rfqPayload, message: e.target.value })}
              placeholder="Any additional notes for the supplier..."
              rows={4}
              className="bg-ui border border-border-subtle rounded-lg px-3 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand w-full resize-none"
            />
          </div>
          {voiceError && <p className="text-error text-xs">⚠️ {voiceError}</p>}
        </Card>

        <Card className="flex flex-col gap-1">
          <SectionLabel>Send Options</SectionLabel>
          <CheckRow label="Send RFQ to Supplier" checked={rfqPayload.sendToSupplier !== false} onChange={v => onChange({ ...rfqPayload, sendToSupplier: v })} />
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
          <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-5 flex flex-col gap-4 shadow-2xl">
            <div>
              <h2 className="text-text-primary font-bold text-lg">Send request to supplier</h2>
            </div>
            <div className="bg-ui-dark/60 rounded-xl p-3 border border-border">
              <p className="text-text-muted text-xs mb-1">You are sending this quote request to:</p>
              <p className="text-brand text-sm font-bold">
                {rfqPayload.supplier.supplierName || 'Selected Supplier'}
              </p>
              {rfqPayload.supplier.supplierEmail && (
                <p className="text-text-muted text-xs mt-0.5">{rfqPayload.supplier.supplierEmail}</p>
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
