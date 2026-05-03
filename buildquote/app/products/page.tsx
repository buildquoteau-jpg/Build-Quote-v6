// Products catalogue — fetches all manufacturers + systems from shared Supabase
import { supabase } from '@/lib/supabase'
import CatalogueClient from './CatalogueClient'

export const revalidate = 300 // re-fetch data every 5 minutes

export default async function ProductsPage() {
  // Fetch manufacturers
  const { data: manufacturers } = await supabase
    .from('manufacturers')
    .select('id, name, slug, description, website_url')
    .order('name')

  // Fetch all systems with colours
  const { data: systems } = await supabase
    .from('systems')
    .select(`
      id, manufacturer_id, name, product_code, category, subcategory,
      description, dimensions, length_m, double_sided, notes, sort_order,
      system_colours ( colour_name, sort_order )
    `)
    .order('sort_order')

  const mfrs = manufacturers ?? []
  const syss = systems ?? []

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff' }}>

      {/* Page header */}
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '56px 24px 32px',
      }}>
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#94a3b8', marginBottom: '10px',
        }}>
          BUILD<span style={{ color: '#f97316' }}>QUOTE</span> · Products
        </p>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800,
          color: '#185D7A', lineHeight: 1.15, margin: '0 0 14px',
        }}>
          Browse building products
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '560px', lineHeight: 1.6, margin: 0 }}>
          Composite timber profiles, cladding and screening available through our supplier network — with colours, dimensions and specifications.
        </p>

        {/* Stats bar */}
        {mfrs.length > 0 && (
          <div style={{
            display: 'flex', gap: '32px', marginTop: '28px',
            paddingTop: '28px', borderTop: '1px solid #e8edf2',
            flexWrap: 'wrap',
          }}>
            <Stat value={mfrs.length} label={mfrs.length === 1 ? 'Manufacturer' : 'Manufacturers'} />
            <Stat value={syss.length} label={syss.length === 1 ? 'Product profile' : 'Product profiles'} />
            <Stat
              value={syss.reduce((n, s) => n + (s.system_colours?.length ?? 0), 0)}
              label="Colour options"
            />
          </div>
        )}
      </div>

      {/* Catalogue */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
        {mfrs.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            background: '#f5f7f9', borderRadius: '20px',
          }}>
            <p style={{ fontSize: '16px', color: '#94a3b8' }}>
              Products coming soon — check back shortly.
            </p>
          </div>
        ) : (
          <CatalogueClient
            manufacturers={mfrs}
            systems={syss as any}
          />
        )}
      </div>

      {/* CTA banner */}
      <div style={{
        background: '#185D7A', color: '#fff',
        padding: '48px 24px', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 10px' }}>
          Ready to get pricing?
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', margin: '0 0 24px' }}>
          Send an RFQ to your local supplier in minutes.
        </p>
        <a href="/rfq" style={{
          display: 'inline-block',
          background: '#f97316', color: '#fff',
          fontWeight: 700, fontSize: '15px',
          padding: '12px 28px', borderRadius: '10px',
          textDecoration: 'none',
        }}>
          Start your quote →
        </a>
      </div>

    </main>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p style={{ fontSize: '26px', fontWeight: 800, color: '#f97316', margin: 0, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0', fontWeight: 500 }}>{label}</p>
    </div>
  )
}
