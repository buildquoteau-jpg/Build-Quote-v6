'use client'

import { useState } from 'react'

type Colour = {
  colour_name: string
  sort_order: number
}

type System = {
  id: string
  manufacturer_id: string
  name: string
  product_code: string
  category: string
  subcategory: string | null
  description: string | null
  dimensions: string | null
  length_m: number | null
  double_sided: boolean
  notes: string | null
  sort_order: number
  system_colours: Colour[]
}

type Manufacturer = {
  id: string
  name: string
  slug: string
  description: string | null
  website_url: string | null
}

type Props = {
  manufacturers: Manufacturer[]
  systems: System[]
}

const CATEGORIES = ['Decking', 'Cladding', 'Screening & Fencing'] as const

const CATEGORY_COLOURS: Record<string, { bg: string; text: string; border: string }> = {
  'Decking':             { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  'Cladding':            { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'Screening & Fencing': { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
}

function ColourChips({ colours }: { colours: Colour[] }) {
  const MAX_SHOW = 6
  const sorted = [...colours].sort((a, b) => a.sort_order - b.sort_order)
  const visible = sorted.slice(0, MAX_SHOW)
  const extra = sorted.length - MAX_SHOW
  if (colours.length === 0) return null
  return (
    <div>
      <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>
        Colours
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {visible.map((c, i) => (
          <span key={i} style={{
            fontSize: '11px', fontWeight: 500,
            background: '#f5f7f9', color: '#334155',
            border: '1px solid #d1d9e0',
            borderRadius: '20px', padding: '2px 8px', whiteSpace: 'nowrap',
          }}>{c.colour_name}</span>
        ))}
        {extra > 0 && (
          <span style={{
            fontSize: '11px', fontWeight: 500,
            background: 'rgba(249,115,22,0.10)', color: '#c2410c',
            border: '1px solid rgba(249,115,22,0.25)',
            borderRadius: '20px', padding: '2px 8px',
          }}>+{extra} more</span>
        )}
      </div>
    </div>
  )
}

function ProductCard({ system }: { system: System }) {
  const cat = CATEGORY_COLOURS[system.category] ?? { bg: '#f5f7f9', text: '#334155', border: '#d1d9e0' }
  return (
    <div
      style={{
        background: '#fff', border: '1px solid #d1d9e0', borderRadius: '14px',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'box-shadow 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.09)'; el.style.borderColor = '#185D7A' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = 'none'; el.style.borderColor = '#d1d9e0' }}
    >
      {/* Header */}
      <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid #e8edf2' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            fontFamily: 'monospace', fontSize: '12px', fontWeight: 700,
            background: '#185D7A', color: '#fff',
            borderRadius: '6px', padding: '2px 8px', letterSpacing: '0.05em',
          }}>{system.product_code}</span>
          <span style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em',
            background: cat.bg, color: cat.text, border: `1px solid ${cat.border}`,
            borderRadius: '20px', padding: '2px 8px', whiteSpace: 'nowrap',
          }}>{system.category}</span>
        </div>
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#000', margin: '0 0 3px' }}>{system.name}</h4>
        {system.subcategory && (
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px' }}>{system.subcategory}</p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#64748b' }}>
          {system.dimensions && <span>📐 {system.dimensions}</span>}
          {system.length_m   && <span>📏 {system.length_m}m</span>}
          {system.double_sided && <span style={{ color: '#4FCBB0', fontWeight: 600 }}>↔ Double sided</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {system.description && (
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.55, margin: 0 }}>{system.description}</p>
        )}
        <ColourChips colours={system.system_colours} />
        {system.notes && (
          <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.5, margin: 0, borderTop: '1px solid #e8edf2', paddingTop: '10px' }}>{system.notes}</p>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 18px', borderTop: '1px solid #e8edf2', display: 'flex', justifyContent: 'flex-end' }}>
        <a href="/rfq" style={{
          fontSize: '12px', fontWeight: 600,
          background: '#f97316', color: '#fff',
          borderRadius: '8px', padding: '6px 14px',
          textDecoration: 'none', transition: 'background 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#ea6c0a' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f97316' }}
        >
          Get pricing →
        </a>
      </div>
    </div>
  )
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      fontSize: '12px', fontWeight: active ? 600 : 500,
      padding: '5px 13px', borderRadius: '20px',
      border: '1px solid', cursor: 'pointer', transition: 'all 0.12s',
      ...(active
        ? { background: '#185D7A', color: '#fff', borderColor: '#185D7A' }
        : { background: '#fff', color: '#334155', borderColor: '#d1d9e0' }),
    }}>{label}</button>
  )
}

export default function CatalogueClient({ manufacturers, systems }: Props) {
  const [activeCat, setActiveCat] = useState<string>('all')

  // Filter systems by category (manufacturer grouping is always on)
  const filtered = systems.filter(s => activeCat === 'all' || s.category === activeCat)

  // Total product count across all manufacturers after filter
  const totalCount = filtered.length

  return (
    <div>
      {/* Global category filter */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
        marginBottom: '36px', paddingBottom: '24px', borderBottom: '1px solid #e8edf2',
      }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginRight: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Filter:
        </span>
        <FilterPill label="All products" active={activeCat === 'all'} onClick={() => setActiveCat('all')} />
        {CATEGORIES.map(cat => (
          <FilterPill key={cat} label={cat} active={activeCat === cat} onClick={() => setActiveCat(cat)} />
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#94a3b8' }}>
          {totalCount} product{totalCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Manufacturer sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
        {manufacturers.map(mfr => {
          const mfrSystems = filtered.filter(s => s.manufacturer_id === mfr.id)
          if (mfrSystems.length === 0) return null

          // Group this manufacturer's products by category
          const catGroups = CATEGORIES
            .map(cat => ({ cat, items: mfrSystems.filter(s => s.category === cat) }))
            .filter(g => g.items.length > 0)

          return (
            <section key={mfr.id}>
              {/* Manufacturer header */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                gap: '16px', flexWrap: 'wrap',
                marginBottom: '24px', paddingBottom: '20px',
                borderBottom: '2px solid #185D7A',
              }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#185D7A', margin: '0 0 4px' }}>
                    {mfr.name}
                  </h2>
                  {mfr.description && (
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, maxWidth: '480px' }}>
                      {mfr.description}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {mfrSystems.length} product{mfrSystems.length !== 1 ? 's' : ''}
                  </span>
                  {mfr.website_url && (
                    <a href={mfr.website_url} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: '12px', fontWeight: 600, color: '#185D7A',
                      border: '1px solid #185D7A', borderRadius: '8px',
                      padding: '5px 12px', textDecoration: 'none',
                      transition: 'all 0.12s',
                    }}
                      onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = '#185D7A'; a.style.color = '#fff' }}
                      onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = 'transparent'; a.style.color = '#185D7A' }}
                    >
                      Website ↗
                    </a>
                  )}
                </div>
              </div>

              {/* Category sub-groups within this manufacturer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {catGroups.map(({ cat, items }) => {
                  const pill = CATEGORY_COLOURS[cat]
                  return (
                    <div key={cat}>
                      {/* Category label */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
                          background: pill.bg, color: pill.text, border: `1px solid ${pill.border}`,
                          borderRadius: '20px', padding: '3px 12px', textTransform: 'uppercase',
                        }}>{cat}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          {items.length} product{items.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Product grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                        gap: '14px',
                      }}>
                        {items.map(sys => <ProductCard key={sys.id} system={sys} />)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 24px',
          background: '#f5f7f9', borderRadius: '16px', color: '#94a3b8',
        }}>
          <p style={{ fontSize: '15px' }}>No products match this filter.</p>
          <button onClick={() => setActiveCat('all')} style={{
            marginTop: '12px', fontSize: '13px', color: '#f97316',
            background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline',
          }}>Clear filter</button>
        </div>
      )}
    </div>
  )
}
