'use client'
import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import { LineItem } from '@/lib/types'
import { getOrCreateDraft } from '@/lib/rfqDraft'

interface ManualEntryScreenProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
  onBack: () => void
  onNext: () => void
  onUploadList: () => void
}

function blankItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    name: '',
    sku: '',
    productId: '',
    desc: '',
    uom: '',
    qty: '',
    confidence: 'high',
    length_mm: null,
    width_mm: null,
    thickness_mm: null,
    height_mm: null,
    diameter_mm: null,
    coverage_m2: null,
    weight_kg: null,
  }
}

export default function ManualEntryScreen({
  items,
  onChange,
  onBack,
  onNext,
  onUploadList,
}: ManualEntryScreenProps) {
  const [error, setError] = useState('')

  useEffect(() => {
    if (items.length === 0) {
      onChange([blankItem()])
    }
  }, [items.length, onChange])

  const update = (id: string, field: keyof LineItem, value: string) => {
    onChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              ...((field === 'name' || field === 'qty') ? { confidence: 'high' as const } : {}),
            }
          : item
      )
    )
  }

  const addRow = () => onChange([...(items.length ? items : [blankItem()]), blankItem()])

  const removeRow = (id: string) => {
    if (items.length <= 1) {
      onChange([blankItem()])
      return
    }
    onChange(items.filter((item) => item.id !== id))
  }

  const handleBrowseManufacturerSystems = async () => {
    try {
      setError('')
      const draft = await getOrCreateDraft()
      window.open('https://mfp.buildquote.com.au/?draft=' + draft, '_blank')
    } catch (err: any) {
      setError(err?.message || 'Could not open Manufacturer Components.')
    }
  }

  const hasAtLeastOneNamedItem = items.some((item) => item.name.trim() !== '')

  const inputClass =
    'w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-heading'
  const compactInputClass =
    'w-full min-w-0 rounded-lg border border-border bg-white px-2.5 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-heading'

  return (
    <div className="flex flex-col gap-5">
      <div className="px-1">
        <h1 className="text-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
          Enter items for Request for Quotation
        </h1>
        <p className="text-text-secondary text-sm sm:text-base font-medium leading-relaxed mt-3">
          Add product name, specs, and quantity.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border-2 border-error-border bg-error-bg px-4 py-3">
          <p className="text-error text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Mobile card layout */}
      <div className="md:hidden flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-2xl border border-border border-l-0 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-navy border-b-2 border-teal pb-0.5">Item {index + 1}</span>
              <button
                onClick={() => removeRow(item.id)}
                className="h-8 w-8 rounded-lg border border-border text-text-muted hover:text-error hover:border-error-border hover:bg-error-bg transition-colors text-sm"
                aria-label={`Remove line item ${index + 1}`}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              <input value={item.name} onChange={(e) => update(item.id, 'name', e.target.value)} placeholder="Product name" className={inputClass} />
              <input value={item.desc} onChange={(e) => update(item.id, 'desc', e.target.value)} placeholder="Specs / description" className={inputClass} />
              <div className="grid grid-cols-3 gap-2">
                <input value={item.sku} onChange={(e) => update(item.id, 'sku', e.target.value)} placeholder="SKU" className={compactInputClass} />
                <input value={item.uom} onChange={(e) => update(item.id, 'uom', e.target.value)} placeholder="UOM" className={compactInputClass} />
                <input value={item.qty} onChange={(e) => update(item.id, 'qty', e.target.value)} placeholder="Qty" className={compactInputClass} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden md:block rounded-2xl border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-[90px_2.3fr_1.6fr_1fr_0.9fr_0.8fr_52px] gap-3 border-b border-border bg-surface-subtle px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Line item</div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Product</div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Specs</div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">SKU</div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">UOM</div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Qty</div>
              <div />
            </div>

            {items.map((item, index) => (
              <div
                key={item.id}
                className={`grid grid-cols-[90px_2.3fr_1.6fr_1fr_0.9fr_0.8fr_52px] gap-3 px-4 py-3 ${
                  index < items.length - 1 ? 'border-b border-border-subtle' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-text-secondary">{index + 1}</span>
                </div>

                <div className="flex items-center">
                  <input
                    value={item.name}
                    onChange={(e) => update(item.id, 'name', e.target.value)}
                    placeholder="Product name"
                    className={inputClass}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    value={item.desc}
                    onChange={(e) => update(item.id, 'desc', e.target.value)}
                    placeholder="Specs"
                    className={inputClass}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    value={item.sku}
                    onChange={(e) => update(item.id, 'sku', e.target.value)}
                    placeholder="SKU"
                    className={compactInputClass}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    value={item.uom}
                    onChange={(e) => update(item.id, 'uom', e.target.value)}
                    placeholder="UOM"
                    className={compactInputClass}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    value={item.qty}
                    onChange={(e) => update(item.id, 'qty', e.target.value)}
                    placeholder="Qty"
                    className={compactInputClass}
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => removeRow(item.id)}
                    className="h-9 w-9 rounded-lg border border-border text-text-muted hover:text-error hover:border-error-border hover:bg-error-bg transition-colors"
                    aria-label={`Remove line item ${index + 1}`}
                    type="button"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={addRow}
          className="sm:flex-1 rounded-2xl border-2 border-heading/20 border-l-[3px] border-l-teal ring-1 ring-inset ring-heading/10 bg-white hover:bg-[rgba(111,236,204,0.06)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(24,93,122,0.10)] px-4 py-3.5 text-heading text-sm font-bold transition-all duration-200"
          type="button"
        >
          + Add another item
        </button>
        <button
          onClick={handleBrowseManufacturerSystems}
          className="sm:flex-1 rounded-2xl border-2 border-heading/20 border-l-[3px] border-l-teal ring-1 ring-inset ring-heading/10 bg-white hover:bg-[rgba(111,236,204,0.06)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(24,93,122,0.10)] px-4 py-3.5 text-heading text-sm font-bold transition-all duration-200"
          type="button"
        >
          Browse manufacturer systems
        </button>
        <button
          onClick={onUploadList}
          className="sm:flex-1 rounded-2xl border-2 border-heading/20 border-l-[3px] border-l-teal ring-1 ring-inset ring-heading/10 bg-white hover:bg-[rgba(111,236,204,0.06)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(24,93,122,0.10)] px-4 py-3.5 text-heading text-sm font-bold transition-all duration-200"
          type="button"
        >
          Upload a list
        </button>
      </div>

      <div className="flex gap-3 pt-1">
        <Button variant="secondary" onClick={onBack} className="flex-1 py-3">
          ← Back
        </Button>
        <Button onClick={onNext} disabled={!hasAtLeastOneNamedItem} className={`flex-1 py-3 transition-all duration-200 ${items.filter(i => i.name.trim() !== '').length >= 2 ? '' : 'opacity-60'}`}>
          Review RFQ →
        </Button>
      </div>
    </div>
  )
}
