'use client'
import { useState, useEffect } from 'react'
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
  sendCopyToSelf: false,
}

export default function RFQPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [items, setItems] = useState<LineItem[]>([])
  const [payload, setPayload] = useState<Omit<RFQPayload, 'rfqId'>>(defaultPayload)
  const [rfqId, setRfqId] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  // Prefill supplier from URL params e.g. /rfq?supplier=M%26B+Bunbury&email=info@mbsales.net.au
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const supplierName = params.get('supplier') || ''
    const supplierEmail = params.get('email') || ''
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

  const handleReset = () => {
    setStep(1)
    setItems([])
    setPayload(defaultPayload)
    setRfqId('')
    setSendError('')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <TopBar currentStep={step} />
      <div className="max-w-2xl mx-auto px-4 py-6">
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
