'use client'
import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import { LineItem } from '@/lib/types'
import { getOrCreateDraft } from '@/lib/rfqDraft'

interface ManualEntryScreenProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
  onBack?: () => void
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

function findDuplicates(items: LineItem[]): Set<string> {
  const seen = new Map<string, string[]>()
  for (const item of items) {
    if (!item.name.trim()) continue
    const key = [item.name.trim().toLowerCase(), item.sku?.trim().toLowerCase() || ''].join('|')
    if (!seen.has(key)) seen.set(key, [])
    seen.get(key)!.push(item.id)
  }
  const dupeIds = new Set<string>()
  for (const ids of seen.values()) {
    if (ids.length > 1) ids.forEach(id => dupeIds.add(id))
  }
  return dupeIds
}

function buildSpecs(item: LineItem): string {
  const parts: string[] = []
  if (item.length_mm) parts.push(item.length_mm + 'mm L')
  if (item.width_mm) parts.push(item.width_mm + 'mm W')
  if (item.thickness_mm) parts.push(item.thickness_mm + 'mm T')
  if (item.height_mm) parts.push(item.height_mm + 'mm H')
  if (item.diameter_mm) parts.push(item.diameter_mm + 'mm dia')
  return parts.length ? parts.join(' × ') : item.desc || ''
}

export default function ManualEntryScreen({
  items,
  onChange,
  onBack,
  onNext,
  onUploadList,
}: ManualEntryScreenProps) {
  const [error, setError] = useState('')
  const duplicateIds = findDuplicates(items)

  const handleClearAll = async () => {
    if (!confirm('Clear all items and start over? This cannot be undone.')) return
    onChange([blankItem()])
    try {
      const draftId = new URLSearchParams(window.location.search).get('draft')
      if (draftId) {
        await fetch('/api/save-draft-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draftId, items: [] }),
        })
      }
    } catch (e) {
      console.error('Failed to clear draft', e)
    }
  }

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
        <div className="flex items-center gap-3 mt-3">
          {duplicateIds.size > 0 && (
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50 px-3 py-2 text-amber-800 text-xs font-semibold flex-1">
              ⚠️ Possible duplicates detected — check highlighted rows
            </div>
          )}
          {items.length > 1 && items.some(i => i.name.trim()) && (
            <button type="button" onClick={handleClearAll} className="text-xs text-error font-semibold hover:underline shrink-0">
              Clear all & start over
            </button>
          )}
        </div>
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
              <input value={buildSpecs(item) || item.desc} onChange={(e) => update(item.id, 'desc', e.target.value)} placeholder="Specs / description" className={inputClass} />
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
            <div className="grid grid-cols-[50px_2.5fr_2fr_0.8fr_0.7fr_0.6fr_40px] gap-3 border-b border-border bg-surface-subtle px-4 py-3">
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
                className={`grid grid-cols-[50px_2.5fr_2fr_0.8fr_0.7fr_0.6fr_40px] gap-3 px-4 py-3 ${
                  index < items.length - 1 ? 'border-b border-border-subtle' : ''} ${item.confidence === 'low' || duplicateIds.has(item.id) ? 'bg-amber-50 border-l-4 border-l-amber-400' : ''
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
                    value={buildSpecs(item) || item.desc}
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
          onClick={onUploadList}
          className="sm:flex-1 rounded-2xl border-2 border-heading/20 border-l-[3px] border-l-teal ring-1 ring-inset ring-heading/10 bg-white hover:bg-[rgba(111,236,204,0.06)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(24,93,122,0.10)] px-4 py-3.5 text-heading text-sm font-bold transition-all duration-200"
          type="button"
        >
          <span className="text-[10px] tracking-[0.2em] font-semibold text-[var(--color-accent)] block">OPTION 1</span> Upload a list
        </button>
        <button
          onClick={handleBrowseManufacturerSystems}
          className="sm:flex-1 rounded-2xl border-2 border-heading/20 border-l-[3px] border-l-teal ring-1 ring-inset ring-heading/10 bg-white hover:bg-[rgba(111,236,204,0.06)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(24,93,122,0.10)] px-4 py-3.5 text-heading text-sm font-bold transition-all duration-200"
          type="button"
        >
          <span className="text-[10px] tracking-[0.2em] font-semibold text-[var(--color-accent)] block">OPTION 2</span> Browse manufacturer systems
        </button>
        <button
          onClick={addRow}
          className="sm:flex-1 rounded-2xl border-2 border-heading/20 border-l-[3px] border-l-teal ring-1 ring-inset ring-heading/10 bg-white hover:bg-[rgba(111,236,204,0.06)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(24,93,122,0.10)] px-4 py-3.5 text-heading text-sm font-bold transition-all duration-200"
          type="button"
        >
          <span className="text-[10px] tracking-[0.2em] font-semibold text-[var(--color-accent)] block">OPTION 3</span> Add items manually
        </button>
      </div>

      <div className="flex gap-3 pt-1">
<Button onClick={onNext} disabled={!hasAtLeastOneNamedItem} className={`flex-1 py-3 transition-all duration-200 ${items.filter(i => i.name.trim() !== '').length >= 2 ? '' : 'opacity-60'}`}>
          <span className="text-white font-bold">Continue — add quote details →</span>
        </Button>
      </div>
    </div>
  )
}
