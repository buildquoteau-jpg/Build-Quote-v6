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
          ? 'border-yellow-500/40 bg-yellow-500/5'
          : active
            ? 'border-orange-500/30 bg-gray-800/80'
            : 'border-gray-700/60 bg-gray-800/40'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium tracking-widest uppercase transition-colors duration-300 ${
          active ? 'text-orange-400' : 'text-gray-600'
        }`}>
          Item {index + 1}
        </span>
        <div className="flex items-center gap-2">
          {isLow && <span className="text-yellow-500 text-xs px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">⚠ Check</span>}
          <button onClick={onRemove} className="text-gray-700 hover:text-red-400 text-sm leading-none transition-colors">✕</button>
        </div>
      </div>

      {/* Name */}
      <input
        value={item.name}
        onChange={e => onChange('name', e.target.value)}
        placeholder="Product Name"
        className={`bg-gray-700/50 border rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none text-sm font-medium w-full transition-colors ${
          isLow ? 'border-yellow-500/30 focus:border-yellow-400' : 'border-gray-600/60 focus:border-orange-500/70'
        }`}
      />

      {/* Description */}
      <textarea
        value={item.desc}
        onChange={e => onChange('desc', e.target.value)}
        placeholder="Description / Specs"
        rows={2}
        className={`bg-gray-700/50 border rounded-lg px-3 py-2 text-gray-400 placeholder-gray-600 focus:outline-none text-xs w-full resize-none leading-relaxed transition-colors ${
          isLow ? 'border-yellow-500/30 focus:border-yellow-400' : 'border-gray-600/60 focus:border-orange-500/70'
        }`}
      />

      {/* SKU / UOM / QTY */}
      <div className="grid grid-cols-3 gap-2">
        {(['sku', 'uom', 'qty'] as const).map(field => (
          <div key={field} className="flex flex-col gap-1">
            <label className="text-gray-600 text-xs uppercase tracking-wider pl-1">{field}</label>
            <input
              value={item[field]}
              onChange={e => onChange(field, e.target.value)}
              placeholder="—"
              className={`bg-gray-700/50 border rounded-lg px-2 py-1.5 text-gray-300 placeholder-gray-700 focus:outline-none text-sm text-center w-full transition-colors ${
                isLow ? 'border-yellow-500/30 focus:border-yellow-400' : 'border-gray-600/60 focus:border-orange-500/70'
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

      {/* Header */}
      <div className="px-1 pb-1">
        {items.length > 0 ? (
          <>
            <p className="text-gray-300 text-sm font-normal leading-snug">
              BuildQuote detected <span className="text-white font-medium">{items.length} line item{items.length !== 1 ? 's' : ''}</span> — please check the specs below and edit anything that doesn't look right.
            </p>
            {lowCount > 0 && (
              <p className="text-yellow-500/80 text-xs mt-1.5">⚠ {lowCount} item{lowCount !== 1 ? 's' : ''} flagged for review</p>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-sm">No items found. Add them manually below.</p>
        )}
      </div>

      {/* Cards */}
      {items.map((item, i) => (
        <ItemCard
          key={item.id}
          item={item}
          index={i}
          onChange={(field, value) => update(item.id, field, value)}
          onRemove={() => remove(item.id)}
        />
      ))}

      {/* Add item */}
      <button
        onClick={add}
        className="border border-dashed border-gray-700 hover:border-orange-500/50 text-gray-600 hover:text-orange-500/70 rounded-xl py-2.5 text-sm transition-colors"
      >
        + Add Line Item
      </button>

      {/* Nav */}
      <div className="flex gap-3 pt-1">
        <Button variant="secondary" onClick={onBack} className="flex-1 py-3">← Back</Button>
        <Button onClick={onNext} disabled={items.length === 0} className="flex-1 py-3">Continue →</Button>
      </div>
    </div>
  )
}
