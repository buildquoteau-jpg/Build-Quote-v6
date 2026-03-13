'use client'
import Button from '../ui/Button'
import { LineItem } from '@/lib/types'

interface RFQScreenProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
  onBack: () => void
  onNext: () => void
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

function formatNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return ''
  const num = Number(value)
  if (Number.isNaN(num)) return String(value)
  return Number.isInteger(num) ? String(num) : String(num)
}

function buildSpecSummary(item: LineItem) {
  const parts: string[] = []

  const dims = [item.length_mm, item.width_mm, item.thickness_mm].filter(
    (v) => v !== null && v !== undefined && v !== ''
  ) as Array<number | string>

  if (dims.length >= 2) {
    parts.push(`${dims.map(formatNumber).join(' × ')} mm`)
  } else if (item.diameter_mm !== null && item.diameter_mm !== undefined && item.diameter_mm !== '') {
    parts.push(`${formatNumber(item.diameter_mm)} mm dia`)
  }

  if (item.coverage_m2 !== null && item.coverage_m2 !== undefined && item.coverage_m2 !== '') {
    parts.push(`${formatNumber(item.coverage_m2)} m²`)
  }

  if (item.weight_kg !== null && item.weight_kg !== undefined && item.weight_kg !== '') {
    parts.push(`${formatNumber(item.weight_kg)} kg`)
  }

  return parts.join(' · ')
}

export default function RFQScreen({ items, onChange, onBack, onNext }: RFQScreenProps) {
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

  const remove = (id: string) => onChange(items.filter((item) => item.id !== id))

  const addManual = () => onChange([...items, blankItem()])

  const lowCount = items.filter((i) => i.confidence === 'low').length

  const inputClass =
    'w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-heading'
  const compactInputClass =
    'w-full min-w-0 rounded-lg border border-border bg-white px-2.5 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-heading'

  return (
    <div className="flex flex-col gap-5">
      <div className="px-1">
        <h1 className="text-heading text-3xl sm:text-4xl font-extrabold tracking-tight">Review your RFQ</h1>
        <p className="text-text-secondary text-sm sm:text-base font-medium leading-relaxed mt-3">
          Check each line item and adjust anything that looks wrong.
        </p>
        <p className="text-text-muted text-sm mt-2">
          {items.length} line item{items.length !== 1 ? 's' : ''}.
        </p>
        {lowCount > 0 && (
          <p className="text-warning text-sm mt-2">
            {lowCount} item{lowCount !== 1 ? 's' : ''} flagged for review
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)] overflow-hidden">
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

            {items.length === 0 ? (
              <div className="px-4 py-6 text-sm text-text-muted">No items found.</div>
            ) : (
              items.map((item, index) => (
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
                      value={buildSpecSummary(item)}
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
                      onClick={() => remove(item.id)}
                      className="h-9 w-9 rounded-lg border border-border text-text-muted hover:text-error hover:border-error-border hover:bg-error-bg transition-colors"
                      aria-label={`Remove line item ${index + 1}`}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={addManual}
          className="sm:flex-1 rounded-2xl border border-border bg-white hover:bg-surface-subtle px-4 py-3.5 text-text-primary text-sm font-semibold transition-colors"
        >
          + Add manual item
        </button>
        <button
          onClick={onBack}
          className="sm:flex-1 rounded-2xl border border-border bg-white hover:bg-surface-subtle px-4 py-3.5 text-text-primary text-sm font-semibold transition-colors"
        >
          + Add manufacturer system
        </button>
      </div>

      <div className="flex gap-3 pt-1">
        <Button variant="secondary" onClick={onBack} className="flex-1 py-3">
          ← Back
        </Button>
        <Button onClick={onNext} disabled={items.length === 0} className="flex-1 py-3">
          Continue →
        </Button>
      </div>
    </div>
  )
}
