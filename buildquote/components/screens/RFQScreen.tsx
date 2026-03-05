'use client'
import { useState, useEffect, useRef } from 'react'
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

  const isLow = item.confidence === 'low'
  const borderClass = isLow ? 'border-yellow-500/50' : 'border-gray-700'
  const bgClass = isLow ? 'bg-yellow-500/5' : 'bg-gray-800'

  return (
    <div
      ref={ref}
      className={`rounded-xl border ${borderClass} ${bgClass} px-3 pt-2.5 pb-3 flex flex-col gap-2 transition-all`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${active ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
          {index + 1}
        </span>
        <div className="flex items-center gap-2">
          {isLow && <span className="text-yellow-400 text-xs bg-yellow-500/15 px-1.5 py-0.5 rounded-full">⚠️ Check</span>}
          <button onClick={onRemove} className="text-gray-600 hover:text-red-400 text-base leading-none transition-colors">✕</button>
        </div>
      </div>

      {/* Name */}
      <input
        value={item.name}
        onChange={e => onChange('name', e.target.value)}
        placeholder="Product Name"
        className={`bg-gray-700/60 border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none text-sm font-medium w-full ${isLow ? 'border-yellow-500/40 focus:border-yellow-400' : 'border-gray-600 focus:border-orange-500'}`}
      />

      {/* Description — textarea for wrapping */}
      <textarea
        value={item.desc}
        onChange={e => onChange('desc', e.target.value)}
        placeholder="Description / Specs"
        rows={2}
        className={`bg-gray-700/60 border rounded-lg px-3 py-2 text-gray-300 placeholder-gray-500 focus:outline-none text-xs w-full resize-none leading-relaxed ${isLow ? 'border-yellow-500/40 focus:border-yellow-400' : 'border-gray-600 focus:border-orange-500'}`}
      />

      {/* SKU / UOM / QTY */}
      <div className="grid grid-cols-3 gap-2">
        {(['sku', 'uom', 'qty'] as const).map(field => (
          <div key={field} className="flex flex-col gap-1">
            <label className="text-gray-600 text-xs uppercase tracking-wider">{field}</label>
            <input
              value={item[field]}
              onChange={e => onChange(field, e.target.value)}
              placeholder={field === 'sku' ? '—' : field.toUpperCase()}
              className={`bg-gray-700/60 border rounded-lg px-2 py-1.5 text-white placeholder-gray-600 focus:outline-none text-sm text-center w-full ${isLow ? 'border-yellow-500/40 focus:border-yellow-400' : 'border-gray-600 focus:border-orange-500'}`}
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
      item.id === id ? { ...item, [field]: value, ...((['name', 'qty', 'desc'].includes(field)) ? { confidence: 'high' as const } : {}) } : item
    ))
  }
  const remove = (id: string) => onChange(items.filter(item => item.id !== id))
  const add = () => onChange([...items, blankItem()])

  const lowCount = items.filter(i => i.confidence === 'low').length

  return (
    <div className="flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          {items.length > 0
            ? <p className="text-white text-sm font-semibold">{items.length} item{items.length !== 1 ? 's' : ''} detected — please review</p>
            : <p className="text-gray-400 text-sm">No items found. Add them manually below.</p>
          }
          {lowCount > 0 && (
            <p className="text-yellow-400 text-xs mt-0.5">⚠️ {lowCount} item{lowCount !== 1 ? 's' : ''} may need checking</p>
          )}
        </div>
        <span className="text-gray-500 text-xs">{items.length} items</span>
      </div>

      {/* Item cards */}
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
        className="border-2 border-dashed border-gray-700 hover:border-orange-500 text-gray-500 hover:text-orange-500 rounded-xl py-2.5 text-sm font-medium transition-colors"
      >
        + Add Line Item
      </button>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button variant="secondary" onClick={onBack} className="flex-1 py-3">← Back</Button>
        <Button onClick={onNext} disabled={items.length === 0} className="flex-1 py-3">Continue →</Button>
      </div>
    </div>
  )
}
