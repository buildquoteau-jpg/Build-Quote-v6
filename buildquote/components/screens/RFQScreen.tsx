'use client'
import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import SectionLabel from '../ui/SectionLabel'
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

export default function RFQScreen({ items, onChange, onBack, onNext }: RFQScreenProps) {
  const update = (id: string, field: keyof LineItem, value: string) => {
    onChange(items.map(item =>
      item.id === id
        ? { ...item, [field]: value, confidence: field === 'qty' || field === 'name' || field === 'desc' ? 'high' : item.confidence }
        : item
    ))
  }
  const remove = (id: string) => onChange(items.filter(item => item.id !== id))
  const add = () => onChange([...items, blankItem()])

  const lowCount = items.filter(i => i.confidence === 'low').length

  return (
    <div className="flex flex-col gap-4">
      <SectionLabel>Review Line Items</SectionLabel>

      {lowCount > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="text-yellow-400 text-lg leading-none mt-0.5">⚠️</span>
          <div>
            <p className="text-yellow-300 text-sm font-medium">{lowCount} item{lowCount > 1 ? 's need' : ' needs'} your attention</p>
            <p className="text-yellow-400/70 text-xs mt-0.5">Check highlighted items — quantities or specs may be incomplete</p>
          </div>
        </div>
      )}

      {items.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-gray-400">No items found. Add them manually below.</p>
        </Card>
      )}

      {items.map((item, i) => (
        <Card
          key={item.id}
          className={`flex flex-col gap-3 ${item.confidence === 'low' ? 'border border-yellow-500/50 bg-yellow-500/5' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs font-medium">ITEM {i + 1}</span>
              {item.confidence === 'low' && (
                <span className="text-yellow-400 text-xs font-medium bg-yellow-500/15 px-2 py-0.5 rounded-full">⚠️ Check</span>
              )}
            </div>
            <button onClick={() => remove(item.id)} className="text-gray-500 hover:text-red-400 text-lg leading-none">✕</button>
          </div>
          <input
            value={item.name}
            onChange={e => update(item.id, 'name', e.target.value)}
            placeholder="Product Name"
            className={`bg-gray-700 border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none text-base font-medium w-full ${item.confidence === 'low' ? 'border-yellow-500/50 focus:border-yellow-400' : 'border-gray-600 focus:border-orange-500'}`}
          />
          <input
            value={item.desc}
            onChange={e => update(item.id, 'desc', e.target.value)}
            placeholder="Description / Specs"
            className={`bg-gray-700 border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none text-sm w-full ${item.confidence === 'low' ? 'border-yellow-500/50 focus:border-yellow-400' : 'border-gray-600 focus:border-orange-500'}`}
          />
          <div className="grid grid-cols-3 gap-2">
            {(['sku', 'uom', 'qty'] as const).map(field => (
              <input
                key={field}
                value={item[field]}
                onChange={e => update(item.id, field, e.target.value)}
                placeholder={field.toUpperCase()}
                className={`bg-gray-700 border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none text-sm w-full ${item.confidence === 'low' ? 'border-yellow-500/50 focus:border-yellow-400' : 'border-gray-600 focus:border-orange-500'}`}
              />
            ))}
          </div>
        </Card>
      ))}

      <button
        onClick={add}
        className="border-2 border-dashed border-gray-600 hover:border-orange-500 text-gray-400 hover:text-orange-500 rounded-xl py-3 text-sm font-medium transition-colors"
      >
        + Add Line Item
      </button>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} className="flex-1 py-3">← Back</Button>
        <Button onClick={onNext} disabled={items.length === 0} className="flex-1 py-3">Continue →</Button>
      </div>
    </div>
  )
}
