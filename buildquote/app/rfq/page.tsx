'use client'
import { useState, useEffect } from 'react'
import { getOrCreateDraft } from '@/lib/rfqDraft'
import TopBar from '@/components/ui/TopBar'
import UploadScreen from '@/components/screens/UploadScreen'
import ManualEntryScreen from '@/components/screens/ManualEntryScreen'
import RFQScreen from '@/components/screens/RFQScreen'
import SendScreen from '@/components/screens/SendScreen'
import SuccessScreen from '@/components/screens/SuccessScreen'
import { LineItem, RFQPayload } from '@/lib/types'

function generateRFQId() {
  const year = new Date().getFullYear()
  const num = Math.floor(1000 + Math.random() * 9000)
  return `RFQ-${year}-${num}`
}

function mergeItems(existing: LineItem[], incoming: LineItem[]) {
  const seen = new Set<string>()
  const merged: LineItem[] = []

  for (const item of [...existing, ...incoming]) {
    const key = [
      item.name || '',
      item.sku || '',
      item.productId || '',
      item.desc || '',
      item.uom || '',
      item.qty || '',
    ].join('|')

    if (seen.has(key)) continue
    seen.add(key)
    merged.push(item)
  }

  return merged
}

const defaultPayload: Omit<RFQPayload, 'rfqId'> = {
  builder: { builderName: '', company: '', abn: '', phone: '', email: '' },
  supplier: { supplierName: '', supplierEmail: '', accountNumber: '' },
  items: [],
  delivery: 'delivery',
  dateRequired: '',
  message: '',
  projectReference: '',
  sendToSupplier: true,
  sendCopyToSelf: true,
}

export default function RFQPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [items, setItems] = useState<LineItem[]>([])
  const [payload, setPayload] = useState<Omit<RFQPayload, 'rfqId'>>(defaultPayload)
  const [rfqId, setRfqId] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  useEffect(() => {
    const existingDraft = new URLSearchParams(window.location.search).get('draft')
    if (existingDraft) return

    getOrCreateDraft().catch(console.error)
  }, [])


  const handleParsed = (parsed: LineItem[]) => {
    const merged = mergeItems(items, parsed)
    setItems(merged)
    setPayload((p) => ({ ...p, items: merged }))
    setStep(2)
  }

  const handleManualEntry = () => {
    setStep(2)
  }

  const handleSend = async () => {
    setSending(true)
    setSendError('')
    const id = generateRFQId()
    const fullPayload: RFQPayload = { ...payload, items, rfqId: id }

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPayload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Server error ${res.status}`)
      }

      setRfqId(id)
      setStep(5)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong sending the RFQ.'
      setSendError(msg)
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    const loadDraftItems = async () => {
      try {
        const draftId = new URLSearchParams(window.location.search).get('draft')
        const res = await fetch('/api/get-draft-items?draft=' + draftId)
        const data = await res.json()
        const mapped = (data.items || []).map((row: any) => ({
          id: crypto.randomUUID(),
          name: row.name || '',
          sku: row.sku || '',
          productId: row.component_id || '',
          desc: row.description || '',
          uom: row.uom || '',
          qty: row.qty ? String(row.qty) : '',
          confidence: 'high',
          length_mm: row.length_mm ?? null,
          width_mm: row.width_mm ?? null,
          thickness_mm: row.thickness_mm ?? null,
          height_mm: row.height_mm ?? null,
          diameter_mm: row.diameter_mm ?? null,
          coverage_m2: row.coverage_m2 ?? null,
          weight_kg: row.weight_kg ?? null,
        }))

        if (mapped.length) {
          setItems((prev) => {
            const merged = mergeItems(prev, mapped)
            setPayload((p) => ({ ...p, items: merged }))
            return merged
          })
          setStep(2)
        }
      } catch (e) {
        console.error('draft load failed', e)
      }
    }
    loadDraftItems()
  }, [])

  const handleReset = () => {
    setStep(1)
    setItems([])
    setPayload(defaultPayload)
    setRfqId('')
    setSendError('')
  }

  return (
    <div className="min-h-screen bg-page text-text-primary">
      <TopBar currentStep={step} onStepClick={(s) => setStep(s as 1 | 2 | 3 | 4 | 5)} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {step === 1 && <UploadScreen onNext={handleParsed} onSkip={handleManualEntry} />}

        {step === 2 && (
          <ManualEntryScreen
            items={items}
            onChange={(nextItems) => {
              setItems(nextItems)
              setPayload((p) => ({ ...p, items: nextItems }))
            }}
            /* onBack removed */
            onNext={() => setStep(4)}
            onUploadList={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <RFQScreen
            items={items}
            onChange={(nextItems) => {
              setItems(nextItems)
              setPayload((p) => ({ ...p, items: nextItems }))
            }}
            /* onBack removed */
            onNext={() => setStep(4)}
            onManualEntry={() => setStep(2)}
            onUploadList={() => setStep(1)}
          />
        )}

        {step === 4 && (
          <SendScreen
            rfqPayload={{ ...payload, items }}
            onChange={setPayload}
            onBack={() => setStep(2)}
            onSend={handleSend}
            sending={sending}
            sendError={sendError}
          />
        )}

        {step === 5 && (
          <SuccessScreen
            rfqId={rfqId}
            payload={{ ...payload, items, rfqId }}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}
