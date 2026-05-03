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
  'Decking':              { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  'Cladding':             { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'Screening & Fencing':  { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
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
            borderRadius: '20px', padding: '2px 8px',
            whiteSpace: 'nowrap',
          }}>
            {c.colour_name}
          </span>
        ))}
        {extra > 0 && (
          <span style={{
            fontSize: '11px', fontWeight: 500,
            background: 'rgba(249,115,22,0.10)', color: '#c2410c',
            border: '1px solid rgba(249,115,22,0.25)',
            borderRadius: '20px', padding: '2px 8px',
          }}>
            +{extra} more
          </span>
        )}
      </div>
    </div>
  )
}

function ProductCard({ system, manufacturerName }: { system: System; manufacturerName: string }) {
  const cat = CATEGORY_COLOURS[system.category] ?? { bg: '#f5f7f9', text: '#334155', border: '#d1d9e0' }

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #d1d9e0',
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)'
        el.style.borderColor = '#185D7A'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = 'none'
        el.style.borderColor = '#d1d9e0'
      }}
    >
      {/* Card header */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #e8edf2' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            fontFamily: 'monospace', fontSize: '12px', fontWeight: 700,
            background: '#185D7A', color: '#fff',
            borderRadius: '6px', padding: '2px 8px',
            letterSpacing: '0.05em',
          }}>
            {system.product_code}
          </span>
          <span style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em',
            background: cat.bg, color: cat.text, border: `1px solid ${cat.border}`,
            borderRadius: '20px', padding: '2px 8px', whiteSpace: 'nowrap',
          }}>
            {system.category}
          </span>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#000', margin: '0 0 4px' }}>
          {system.name}
        </h3>

        {system.subcategory && (
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px' }}>{system.subcategory}</p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#64748b' }}>
          {system.dimensions && (
            <span>📐 {system.dimensions}</span>
          )}
          {system.length_m && (
            <span>📏 {system.length_m}m</span>
          )}
          {system.double_sided && (
            <span style={{ color: '#4FCBB0', fontWeight: 600 }}>↔ Double sided</span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {system.description && (
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.55, margin: 0 }}>
            {system.description}
          </p>
        )}

        <ColourChips colours={system.system_colours} />

        {system.notes && (
          <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.5, margin: 0, borderTop: '1px solid #e8edf2', paddingTop: '10px' }}>
            {system.notes}
          </p>
        )}
      </div>

      {/* Card footer */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid #e8edf2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{manufacturerName}</span>
        <a
          href={`/rfq`}
          style={{
            fontSize: '12px', fontWeight: 600,
            background: '#f97316', color: '#fff',
            borderRadius: '8px', padding: '6px 14px',
            textDecoration: 'none',
            transition: 'background 0.15s',
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

export default function CatalogueClient({ manufacturers, systems }: Props) {
  const [activeMfr, setActiveMfr] = useState<string>('all')
  const [activeCat, setActiveCat] = useState<string>('all')

  const mfrMap = Object.fromEntries(manufacturers.map(m => [m.id, m]))

  const filtered = systems.filter(s => {
    const mfrMatch = activeMfr === 'all' || s.manufacturer_id === activeMfr
    const catMatch = activeCat === 'all' || s.category === activeCat
    return mfrMatch && catMatch
  })

  // Group filtered systems by category preserving catalogue order
  const grouped = CATEGORIES.map(cat => ({
    category: cat,
    systems: filtered.filter(s => s.category === cat),
  })).filter(g => g.systems.length > 0)

  const showMfrFilter = manufacturers.length > 1

  return (
    <div>
      {/* Filter bar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '16px',
        alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: '1px solid #e8edf2',
      }}>
        {/* Manufacturer pills — only show if more than one */}
        {showMfrFilter && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <FilterPill label="All manufacturers" active={activeMfr === 'all'} onClick={() => setActiveMfr('all')} />
            {manufacturers.map(mf => (
              <FilterPill key={mf.id} label={mf.name} active={activeMfr === mf.id} onClick={() => setActiveMfr(mf.id)} />
            ))}
          </div>
        )}

        {/* Category pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <FilterPill label="All products" active={activeCat === 'all'} onClick={() => setActiveCat('all')} />
          {CATEGORIES.map(cat => (
            <FilterPill key={cat} label={cat} active={activeCat === cat} onClick={() => setActiveCat(cat)} accent />
          ))}
        </div>
      </div>

      {/* Results count */}
      <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '28px' }}>
        {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        {activeMfr !== 'all' && ` · ${mfrMap[activeMfr]?.name}`}
        {activeCat !== 'all' && ` · ${activeCat}`}
      </p>

      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 24px',
          background: '#f5f7f9', borderRadius: '16px',
          color: '#94a3b8',
        }}>
          <p style={{ fontSize: '15px' }}>No products match these filters.</p>
          <button
            onClick={() => { setActiveMfr('all'); setActiveCat('all') }}
            style={{ marginTop: '12px', fontSize: '13px', color: '#f97316', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {grouped.map(({ category, systems: catSystems }) => (
            <div key={category}>
              {/* Category heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#185D7A', margin: 0 }}>{category}</h2>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{catSystems.length} product{catSystems.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Product grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
              }}>
                {catSystems.map(sys => (
                  <ProductCard
                    key={sys.id}
                    system={sys}
                    manufacturerName={mfrMap[sys.manufacturer_id]?.name ?? ''}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterPill({ label, active, onClick, accent }: {
  label: string; active: boolean; onClick: () => void; accent?: boolean
}) {
  const activeStyle = accent
    ? { background: '#185D7A', color: '#fff', borderColor: '#185D7A' }
    : { background: '#f97316', color: '#fff', borderColor: '#f97316' }

  return (
    <button
      onClick={onClick}
      style={{
        fontSize: '13px', fontWeight: active ? 600 : 500,
        padding: '6px 14px', borderRadius: '20px',
        border: '1px solid',
        cursor: 'pointer',
        transition: 'all 0.12s',
        ...(active
          ? activeStyle
          : { background: '#fff', color: '#334155', borderColor: '#d1d9e0' }
        ),
      }}
    >
      {label}
    </button>
  )
}
