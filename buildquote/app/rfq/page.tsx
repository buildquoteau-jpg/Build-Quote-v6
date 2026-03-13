'use client'
import { useState, useEffect } from 'react'
import { getOrCreateDraft } from '@/lib/rfqDraft'
import TopBar from '@/components/ui/TopBar'
import UploadScreen from '@/components/screens/UploadScreen'
import RFQScreen from '@/components/screens/RFQScreen'
import SendScreen from '@/components/screens/SendScreen'
import SuccessScreen from '@/components/screens/SuccessScreen'
import { LineItem, RFQPayload } from '@/lib/types'

function generateRFQId() {
  const year = new Date().getFullYear()
  const num = Math.floor(1000 + Math.random() * 9000)
  return `RFQ-${year}-${num}`
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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [items, setItems] = useState<LineItem[]>([])
  const [payload, setPayload] = useState<Omit<RFQPayload, 'rfqId'>>(defaultPayload)
  const [rfqId, setRfqId] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  useEffect(() => { window.scrollTo(0, 0) }, [step])

  useEffect(() => {
    const existingDraft = new URLSearchParams(window.location.search).get('draft')
    if (existingDraft) return

    getOrCreateDraft()
      .then((id) => {
        const url = new URL(window.location.href)
        url.searchParams.set('draft', id)
        window.history.replaceState({}, '', url)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    // Prefill supplier from directory
    const supplierName = params.get('supplier') || ''
    const supplierEmail = ''
    if (supplierName || supplierEmail) {
      setPayload(p => ({
        ...p,
        supplier: {
          ...p.supplier,
          supplierName,
          supplierEmail,
        }
      }))
    }

    // Prefill items from manufacturer portal — items arrive already shaped as LineItem
    const itemsParam = params.get('items')
    if (itemsParam) {
      try {
        const parsed: LineItem[] = JSON.parse(decodeURIComponent(itemsParam))
        // Ensure every item has a unique id in case it's missing
        const withIds: LineItem[] = parsed.map((item: any) => ({
          id: item.id || crypto.randomUUID(),
          name: item.name || '',
          sku: item.sku || '',
          productId: item.productId || '',
          desc: item.desc || '',
          uom: item.uom || '',
          qty: item.qty ? String(item.qty) : '',
          confidence: item.confidence || 'high',
          length_mm: item.length_mm ?? null,
          width_mm: item.width_mm ?? null,
          thickness_mm: item.thickness_mm ?? null,
          height_mm: item.height_mm ?? null,
          diameter_mm: item.diameter_mm ?? null,
          coverage_m2: item.coverage_m2 ?? null,
          weight_kg: item.weight_kg ?? null,
        }))
        setItems(withIds)
        setPayload(p => ({ ...p, items: withIds }))
        // Skip straight to review screen if items are prefilled
        setStep(2)
      } catch (e) {
        console.error('Failed to parse items from URL', e)
      }
    }
  }, [])

  const handleParsed = (parsed: LineItem[]) => {
    setItems(parsed)
    setPayload(p => ({ ...p, items: parsed }))
    setStep(2)
  }

  const handleSkip = () => {
    setItems([])
    setPayload(p => ({ ...p, items: [] }))
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
      setStep(4)
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
          setItems(mapped)
          setPayload(p => ({ ...p, items: mapped }))
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
      <TopBar currentStep={step} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {step === 1 && (
          <UploadScreen
            onNext={handleParsed}
            onSkip={handleSkip}
          />
        )}
        {step === 2 && (
          <RFQScreen
            items={items}
            onChange={setItems}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <SendScreen
            rfqPayload={{ ...payload, items }}
            onChange={setPayload}
            onBack={() => setStep(2)}
            onSend={handleSend}
            sending={sending}
            sendError={sendError}
          />
        )}
        {step === 4 && (
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
