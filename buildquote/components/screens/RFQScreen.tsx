'use client'
import { useEffect, useRef, useState } from 'react'
import Button from '../ui/Button'
import { LineItem } from '@/lib/types'

interface RFQScreenProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
  onBack: () => void
  onNext: () => void
}

function blankItem(): LineItem {
  return { id: crypto.randomUUID(), name: '', sku: '', productId: '', desc: '', uom: '', qty: '', confidence: 'high' }
}

function ItemCard({ item, index, onChange, onRemove }: {
  item: LineItem
  index: number
  onChange: (field: keyof LineItem, value: string) => void
  onRemove: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const isLow = item.confidence === 'low'

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.intersectionRatio > 0.5),
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`rounded-xl border px-3 pt-2 pb-3 flex flex-col gap-2 transition-all duration-300 ${
        isLow
          ? 'border-warning/40 bg-warning/5'
          : active
            ? 'border-brand/30 bg-surface'
            : 'border-border/60 bg-surface/40'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium tracking-widest uppercase transition-colors duration-300 ${
          active ? 'text-brand' : 'text-text-disabled'
        }`}>
          Item {index + 1}
        </span>
        <div className="flex items-center gap-2">
          {isLow && (
            <span className="text-warning text-xs px-1.5 py-0.5 rounded-full bg-warning/10 border border-warning/20">
              ⚠ Check
            </span>
          )}
          <button onClick={onRemove} className="text-text-disabled hover:text-error text-sm leading-none transition-colors">✕</button>
        </div>
      </div>

      <input
        value={item.name}
        onChange={e => onChange('name', e.target.value)}
        placeholder="Product Name"
        className={`bg-ui/50 border rounded-lg px-3 py-2 text-text-primary placeholder-text-disabled focus:outline-none text-sm font-medium w-full transition-colors ${
          isLow ? 'border-warning/30 focus:border-warning' : 'border-border/60 focus:border-brand/70'
        }`}
      />

      <textarea
        value={item.desc}
        onChange={e => onChange('desc', e.target.value)}
        placeholder="Description / Specs"
        rows={2}
        className={`bg-ui/50 border rounded-lg px-3 py-2 text-text-muted placeholder-text-disabled focus:outline-none text-xs w-full resize-none leading-relaxed transition-colors ${
          isLow ? 'border-warning/30 focus:border-warning' : 'border-border/60 focus:border-brand/70'
        }`}
      />

      <div className="grid grid-cols-3 gap-2">
        {(['sku', 'uom', 'qty'] as const).map(field => (
          <div key={field} className="flex flex-col gap-1">
            <label className="text-text-disabled text-xs uppercase tracking-wider pl-1">{field}</label>
            <input
              value={item[field]}
              onChange={e => onChange(field, e.target.value)}
              placeholder="—"
              className={`bg-ui/50 border rounded-lg px-2 py-1.5 text-text-secondary placeholder-text-disabled focus:outline-none text-sm text-center w-full transition-colors ${
                isLow ? 'border-warning/30 focus:border-warning' : 'border-border/60 focus:border-brand/70'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RFQScreen({ items, onChange, onBack, onNext }: RFQScreenProps) {
  const update = (id: string, field: keyof LineItem, value: string) => {
    onChange(items.map(item =>
      item.id === id
        ? { ...item, [field]: value, ...(['name', 'qty', 'desc'].includes(field) ? { confidence: 'high' as const } : {}) }
        : item
    ))
  }
  const remove = (id: string) => onChange(items.filter(item => item.id !== id))
  const add = () => onChange([...items, blankItem()])
  const lowCount = items.filter(i => i.confidence === 'low').length

  return (
    <div className="flex flex-col gap-3">

      <div className="px-1 pb-1">
        {items.length > 0 ? (
          <>
            <p className="text-text-secondary text-sm font-normal leading-snug">
              BuildQuote detected <span className="text-text-primary font-medium">{items.length} line item{items.length !== 1 ? 's' : ''}</span> — please check the specs below and edit anything that doesn&apos;t look right.
            </p>
            {lowCount > 0 && (
              <p className="text-warning/80 text-xs mt-1.5">⚠ {lowCount} item{lowCount !== 1 ? 's' : ''} flagged for review</p>
            )}
          </>
        ) : (
          <p className="text-text-faint text-sm">No items found. Add them manually below.</p>
        )}
      </div>

      {items.map((item, i) => (
        <ItemCard
          key={item.id}
          item={item}
          index={i}
          onChange={(field, value) => update(item.id, field, value)}
          onRemove={() => remove(item.id)}
        />
      ))}

      <button
        onClick={add}
        className="border border-dashed border-border hover:border-brand/50 text-text-disabled hover:text-brand/70 rounded-xl py-2.5 text-sm transition-colors"
      >
        + Add Line Item
      </button>

      <div className="flex gap-3 pt-1">
        <Button variant="secondary" onClick={onBack} className="flex-1 py-3">← Back</Button>
        <Button onClick={onNext} disabled={items.length === 0} className="flex-1 py-3">Continue →</Button>
      </div>

    </div>
  )
}
