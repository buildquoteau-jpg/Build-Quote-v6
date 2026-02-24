'use client'
import { useState } from 'react'
import suppliersRaw from '@/data/suppliers.json'

type Supplier = {
  name: string
  phone: string | null
  website: string | null
  address: string | null
  email: string | null
  photo: string | null
  description: string | null
  operational: string | null
  hours: Record<string, string[]>
  region: string
  area: string
  trade_type: string
  category: string
}

const suppliers = suppliersRaw as Supplier[]

const REGIONS = [
  { name: 'Bunbury', desc: 'The major regional hub for Southwest WA construction.' },
  { name: 'Busselton', desc: 'Coastal city suppliers serving the Capes region.' },
  { name: 'Dunsborough', desc: 'Suppliers for the Dunsborough and Yallingup area.' },
  { name: 'Margaret River', desc: 'Building suppliers for the Margaret River wine region.' },
  { name: 'Australind & Harvey', desc: 'Suppliers north of Bunbury in the Harvey Shire.' },
  { name: 'Manjimup', desc: 'Timber country — suppliers for the Warren region.' },
  { name: 'Bridgetown', desc: 'Suppliers for the Blackwood Valley.' },
  { name: 'Walpole', desc: 'Remote south coast supply.' },
  { name: 'Albany', desc: 'Great Southern region — major supply hub for the south.' },
  { name: 'Perth', desc: 'Metro Perth suppliers with Southwest WA reach.' },
]

const TYPE_COLOURS: Record<string, string> = {
  Trade: '#4a8fa0',
  Retail: '#b8a98a',
  Wholesale: '#7ec8a0',
  Hire: '#c49a6c',
}

// Slug for demo supplier page
function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// M&B Bunbury is our demo supplier page
const DEMO_SLUG = 'm-b-trade-centre-bunbury'

function isOpenNow(hours: Record<string, string[]>): boolean | null {
  if (!hours || Object.keys(hours).length === 0) return null
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const now = new Date()
  const dayHours = hours[days[now.getDay()]]
  if (!dayHours || dayHours[0] === 'Closed') return false
  const match = dayHours[0].match(/(\d+(?::\d+)?)(am|pm)-(\d+(?::\d+)?)(am|pm)/i)
  if (!match) return null
  const toMins = (t: string, ap: string) => {
    const [h, m = '0'] = t.split(':')
    let hr = parseInt(h)
    if (ap.toLowerCase() === 'pm' && hr !== 12) hr += 12
    if (ap.toLowerCase() === 'am' && hr === 12) hr = 0
    return hr * 60 + parseInt(m)
  }
  const cur = now.getHours() * 60 + now.getMinutes()
  return cur >= toMins(match[1], match[2]) && cur < toMins(match[3], match[4])
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function DirectoryPage() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  if (activeRegion) {
    return (
      <RegionView
        region={activeRegion}
        suppliers={suppliers.filter(s => s.region === activeRegion)}
        onBack={() => setActiveRegion(null)}
      />
    )
  }

  const filtered = REGIONS.filter(r => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      r.name.toLowerCase().includes(s) ||
      suppliers.some(sup => sup.region === r.name && sup.name.toLowerCase().includes(s))
    )
  })

  return (
    <>
      <style>{landingCSS}</style>
      <div className="dir">
        <nav className="dir-nav">
          <a href="/" className="logo">BUILD<span>QUOTE</span></a>
          <span className="nav-tag">Southwest WA Supplier Directory</span>
        </nav>

        <div className="dir-hero">
          <p className="eyebrow">Southwest Western Australia</p>
          <h1 className="dir-title">Supplier<br />Directory</h1>
          <p className="dir-sub">
            Find building material suppliers across Southwest WA.
            Select your region to browse local suppliers.
          </p>
          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Search regions or supplier names..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="regions-grid">
          {filtered.map(r => {
            const count = suppliers.filter(s => s.region === r.name).length
            return (
              <button key={r.name} className="region-card" onClick={() => setActiveRegion(r.name)}>
                <div>
                  <h2 className="region-name">{r.name}</h2>
                  <p className="region-desc">{r.desc}</p>
                </div>
                <div className="region-foot">
                  <span className="region-count">{count} suppliers</span>
                  <span className="region-arrow">↗</span>
                </div>
              </button>
            )
          })}
          {filtered.length === 0 && (
            <p className="no-results">No results for &ldquo;{search}&rdquo;</p>
          )}
        </div>

        <footer className="dir-footer">
          <span>© 2025 BuildQuote</span>
          <span>Southwest WA · Australia</span>
          <span>Data updated Feb 2026</span>
        </footer>
      </div>
    </>
  )
}

// ── REGION VIEW ───────────────────────────────────────────────────────────
function RegionView({
  region,
  suppliers,
  onBack,
}: {
  region: string
  suppliers: Supplier[]
  onBack: () => void
}) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [filterCat, setFilterCat] = useState('All')

  const tradeTypes = ['All', ...Array.from(new Set(suppliers.map(s => s.trade_type))).sort()]
  const categories = ['All', ...Array.from(new Set(suppliers.map(s => s.category))).sort()]

  const filtered = suppliers.filter(s => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.address && s.address.toLowerCase().includes(search.toLowerCase()))
    const matchType = filterType === 'All' || s.trade_type === filterType
    const matchCat = filterCat === 'All' || s.category === filterCat
    return matchSearch && matchType && matchCat
  })

  return (
    <>
      <style>{regionCSS}</style>
      <div className="rv">
        <nav className="rv-nav">
          <button className="back-btn" onClick={onBack}>← All Regions</button>
          <a href="/" className="logo-sm">BUILD<span>QUOTE</span></a>
        </nav>

        <div className="rv-hero">
          <p className="eyebrow">Southwest WA Supplier Directory</p>
          <h1 className="rv-title">{region}</h1>
          <p className="rv-count">{filtered.length} of {suppliers.length} suppliers</p>
        </div>

        <div className="filters">
          <input
            className="filter-search"
            placeholder="Search suppliers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="filter-pills">
            <span className="filter-label">Type:</span>
            {tradeTypes.map(t => (
              <button
                key={t}
                className={`pill${filterType === t ? ' active' : ''}`}
                onClick={() => setFilterType(t)}
                style={filterType === t && t !== 'All' ? { borderColor: TYPE_COLOURS[t], color: TYPE_COLOURS[t] } : {}}
              >{t}</button>
            ))}
          </div>
          <div className="filter-pills">
            <span className="filter-label">Category:</span>
            {categories.map(c => (
              <button
                key={c}
                className={`pill${filterCat === c ? ' active' : ''}`}
                onClick={() => setFilterCat(c)}
              >{c}</button>
            ))}
          </div>
        </div>

        <div className="sup-list">
          {filtered.length === 0 && <p className="no-results">No suppliers match your filters.</p>}
          {filtered.map((s, i) => {
            const open = isOpenNow(s.hours)
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            const today = days[new Date().getDay()]
            const todayHours = s.hours[today]
            const slug = toSlug(s.name)
            const isDemo = slug === DEMO_SLUG

            return (
              <div key={i} className="sup-item">
                <div className="sup-main">
                  <div className="sup-header">
                    <h2 className="sup-name">
                      {isDemo
                        ? <a href={`/directory/supplier/${DEMO_SLUG}`} className="sup-name-link">{s.name}</a>
                        : s.name
                      }
                    </h2>
                    <div className="sup-badges">
                      <span className="badge type-badge" style={{ borderColor: TYPE_COLOURS[s.trade_type] || '#4a8fa0', color: TYPE_COLOURS[s.trade_type] || '#4a8fa0' }}>
                        {s.trade_type}
                      </span>
                      <span className="badge cat-badge">{s.category}</span>
                    </div>
                  </div>

                  {s.address && <p className="sup-address">📍 {s.address}</p>}
                  {s.description && <p className="sup-desc">{s.description}</p>}

                  <div className="sup-actions">
                    {s.phone && (
                      <a href={`tel:${s.phone}`} className="action-btn phone-btn">
                        📞 {s.phone}
                      </a>
                    )}
                    <a href="/rfq" className="action-btn rfq-btn">
                      ✉ Request Quote
                    </a>
                    {isDemo && (
                      <a href={`/directory/supplier/${DEMO_SLUG}`} className="action-btn profile-btn">
                        View Profile →
                      </a>
                    )}
                  </div>
                </div>

                <div className="sup-right">
                  {open !== null && (
                    <span className={`open-badge ${open ? 'open' : 'closed'}`}>
                      {open ? '● Open Now' : '● Closed'}
                    </span>
                  )}
                  {todayHours && <span className="hours-today">Today: {todayHours[0]}</span>}
                </div>
              </div>
            )
          })}
        </div>

        <footer className="rv-footer">© 2025 BuildQuote · Southwest WA Supplier Directory</footer>
      </div>
    </>
  )
}

// ── CSS ───────────────────────────────────────────────────────────────────
const landingCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;800&family=Barlow:wght@300;400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--teal-l:#4a8fa0;--accent:#8cb8c4;--white:#f5f2ed;--bg:#0f1e26}
  body{background:var(--bg)}
  .dir{min-height:100vh;background:var(--bg);font-family:'Barlow',sans-serif;color:var(--white)}
  .dir-nav{display:flex;justify-content:space-between;align-items:center;padding:1.5rem 3rem;border-bottom:1px solid rgba(74,143,160,0.2);position:sticky;top:0;background:rgba(15,30,38,0.96);backdrop-filter:blur(10px);z-index:100}
  .logo{font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:800;letter-spacing:0.15em;text-decoration:none;color:var(--white)}
  .logo span{color:var(--accent)}
  .nav-tag{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;letter-spacing:0.3em;color:rgba(245,242,237,0.3);text-transform:uppercase}
  .dir-hero{padding:4rem 3rem 2rem;max-width:860px}
  .eyebrow{font-family:'Barlow Condensed',sans-serif;font-size:0.68rem;letter-spacing:0.4em;color:var(--accent);text-transform:uppercase;margin-bottom:1rem}
  .dir-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(2.5rem,6vw,4.5rem);font-weight:800;line-height:0.95;text-transform:uppercase;margin-bottom:1rem}
  .dir-sub{font-size:0.9rem;font-weight:300;color:rgba(245,242,237,0.5);line-height:1.7;max-width:460px;margin-bottom:2rem}
  .search-wrap{max-width:400px}
  .search-input{width:100%;background:rgba(30,58,74,0.5);border:1px solid rgba(74,143,160,0.25);padding:0.75rem 1rem;font-family:'Barlow',sans-serif;font-size:0.88rem;color:var(--white);outline:none;transition:border-color 0.2s}
  .search-input::placeholder{color:rgba(245,242,237,0.28)}
  .search-input:focus{border-color:var(--accent)}
  .regions-grid{padding:2rem 3rem 3rem;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1px}
  .region-card{background:rgba(30,58,74,0.4);border:1px solid rgba(74,143,160,0.12);padding:2rem;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;min-height:155px;position:relative;overflow:hidden;transition:background 0.22s,border-color 0.22s,transform 0.2s;text-align:left}
  .region-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:0;background:var(--teal-l);transition:height 0.3s}
  .region-card:hover{background:rgba(46,107,122,0.2);border-color:rgba(74,143,160,0.3);transform:translateY(-2px)}
  .region-card:hover::before{height:100%}
  .region-name{font-family:'Barlow Condensed',sans-serif;font-size:1.45rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:0.4rem;color:var(--white)}
  .region-desc{font-size:0.76rem;font-weight:300;color:rgba(245,242,237,0.45);line-height:1.5}
  .region-foot{display:flex;justify-content:space-between;align-items:center;margin-top:1.2rem}
  .region-count{font-family:'Barlow Condensed',sans-serif;font-size:0.6rem;letter-spacing:0.28em;text-transform:uppercase;color:var(--accent)}
  .region-arrow{font-size:1.1rem;color:rgba(245,242,237,0.15);transition:color 0.2s,transform 0.2s}
  .region-card:hover .region-arrow{color:var(--accent);transform:translate(3px,-3px)}
  .no-results{padding:3rem;color:rgba(245,242,237,0.3);font-size:0.88rem}
  .dir-footer{display:flex;justify-content:space-between;padding:1.2rem 3rem;border-top:1px solid rgba(74,143,160,0.12);font-size:0.6rem;letter-spacing:0.18em;color:rgba(245,242,237,0.22);text-transform:uppercase}
  @media(max-width:680px){.dir-nav,.dir-hero,.regions-grid,.dir-footer{padding-left:1.5rem;padding-right:1.5rem}.nav-tag{display:none}}
`

const regionCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;800&family=Barlow:wght@300;400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--teal-l:#4a8fa0;--accent:#8cb8c4;--white:#f5f2ed;--bg:#0f1e26}
  body{background:var(--bg)}
  .rv{min-height:100vh;background:var(--bg);font-family:'Barlow',sans-serif;color:var(--white)}
  .rv-nav{display:flex;justify-content:space-between;align-items:center;padding:1.2rem 3rem;border-bottom:1px solid rgba(74,143,160,0.2);position:sticky;top:0;background:rgba(15,30,38,0.96);backdrop-filter:blur(10px);z-index:100}
  .back-btn{font-family:'Barlow Condensed',sans-serif;font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,242,237,0.45);background:none;border:none;cursor:pointer;transition:color 0.2s}
  .back-btn:hover{color:var(--accent)}
  .logo-sm{font-family:'Barlow Condensed',sans-serif;font-size:1.1rem;font-weight:800;letter-spacing:0.15em;text-decoration:none;color:var(--white)}
  .logo-sm span{color:var(--accent)}
  .rv-hero{padding:3rem 3rem 1.5rem}
  .eyebrow{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;letter-spacing:0.38em;color:var(--accent);text-transform:uppercase;margin-bottom:0.8rem}
  .rv-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:800;text-transform:uppercase;line-height:1;margin-bottom:0.4rem}
  .rv-count{font-size:0.76rem;color:rgba(245,242,237,0.32);letter-spacing:0.04em}
  .filters{padding:1rem 3rem 1.5rem;border-bottom:1px solid rgba(74,143,160,0.12);display:flex;flex-direction:column;gap:0.8rem}
  .filter-search{width:100%;max-width:360px;background:rgba(30,58,74,0.5);border:1px solid rgba(74,143,160,0.25);padding:0.6rem 1rem;font-family:'Barlow',sans-serif;font-size:0.84rem;color:var(--white);outline:none;transition:border-color 0.2s}
  .filter-search::placeholder{color:rgba(245,242,237,0.28)}
  .filter-search:focus{border-color:var(--accent)}
  .filter-pills{display:flex;flex-wrap:wrap;align-items:center;gap:0.35rem}
  .filter-label{font-family:'Barlow Condensed',sans-serif;font-size:0.58rem;letter-spacing:0.22em;color:rgba(245,242,237,0.28);text-transform:uppercase;margin-right:0.25rem}
  .pill{font-family:'Barlow Condensed',sans-serif;font-size:0.6rem;letter-spacing:0.14em;text-transform:uppercase;padding:0.26rem 0.65rem;border:1px solid rgba(74,143,160,0.2);color:rgba(245,242,237,0.38);background:none;cursor:pointer;transition:all 0.18s}
  .pill:hover{border-color:rgba(74,143,160,0.45);color:var(--white)}
  .pill.active{border-color:var(--accent);color:var(--accent);background:rgba(140,184,196,0.07)}
  .sup-list{padding:0.5rem 3rem 4rem;display:flex;flex-direction:column;gap:1px}
  .sup-item{background:rgba(30,58,74,0.35);border:1px solid rgba(74,143,160,0.1);padding:1.4rem 2rem;display:grid;grid-template-columns:1fr auto;gap:1.5rem;align-items:start;position:relative;transition:background 0.2s,border-color 0.2s}
  .sup-item::before{content:'';position:absolute;top:0;left:0;width:3px;height:0;background:var(--teal-l);transition:height 0.28s}
  .sup-item:hover{background:rgba(46,107,122,0.14);border-color:rgba(74,143,160,0.2)}
  .sup-item:hover::before{height:100%}
  .sup-header{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;margin-bottom:0.45rem}
  .sup-name{font-family:'Barlow Condensed',sans-serif;font-size:1.12rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:var(--white)}
  .sup-name-link{color:var(--white);text-decoration:none;border-bottom:1px solid rgba(140,184,196,0.4);transition:border-color 0.2s}
  .sup-name-link:hover{border-color:var(--accent);color:var(--accent)}
  .sup-badges{display:flex;gap:0.35rem;flex-wrap:wrap}
  .badge{font-family:'Barlow Condensed',sans-serif;font-size:0.56rem;letter-spacing:0.16em;text-transform:uppercase;padding:0.18rem 0.5rem;border:1px solid}
  .cat-badge{border-color:rgba(245,242,237,0.14);color:rgba(245,242,237,0.35)}
  .sup-address{font-size:0.76rem;color:rgba(245,242,237,0.42);margin-bottom:0.55rem}
  .sup-desc{font-size:0.76rem;color:rgba(245,242,237,0.4);line-height:1.55;margin-bottom:0.9rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;max-width:560px}
  .sup-actions{display:flex;gap:0.45rem;flex-wrap:wrap}
  .action-btn{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;letter-spacing:0.14em;text-transform:uppercase;padding:0.38rem 0.85rem;border:1px solid;text-decoration:none;transition:all 0.18s;display:inline-flex;align-items:center;gap:0.3rem}
  .phone-btn{border-color:rgba(126,200,160,0.38);color:#7ec8a0}
  .phone-btn:hover{background:rgba(126,200,160,0.1);border-color:#7ec8a0}
  .rfq-btn{border-color:rgba(140,184,196,0.5);color:var(--accent);background:rgba(140,184,196,0.08)}
  .rfq-btn:hover{background:rgba(140,184,196,0.18);border-color:var(--accent)}
  .profile-btn{border-color:rgba(184,169,138,0.4);color:#b8a98a}
  .profile-btn:hover{background:rgba(184,169,138,0.1);border-color:#b8a98a}
  .sup-right{display:flex;flex-direction:column;align-items:flex-end;gap:0.45rem;min-width:90px}
  .open-badge{font-family:'Barlow Condensed',sans-serif;font-size:0.6rem;letter-spacing:0.16em;text-transform:uppercase;padding:0.22rem 0.55rem;white-space:nowrap}
  .open-badge.open{color:#7ec8a0;border:1px solid rgba(126,200,160,0.32);background:rgba(126,200,160,0.07)}
  .open-badge.closed{color:rgba(245,242,237,0.28);border:1px solid rgba(245,242,237,0.1)}
  .hours-today{font-size:0.68rem;color:rgba(245,242,237,0.28);white-space:nowrap}
  .no-results{padding:3rem 0;color:rgba(245,242,237,0.3);font-size:0.88rem}
  .rv-footer{padding:1.2rem 3rem;border-top:1px solid rgba(74,143,160,0.1);font-size:0.6rem;letter-spacing:0.14em;color:rgba(245,242,237,0.2);text-transform:uppercase}
  @media(max-width:680px){
    .rv-nav,.rv-hero,.filters,.sup-list,.rv-footer{padding-left:1.5rem;padding-right:1.5rem}
    .sup-item{grid-template-columns:1fr;gap:0.8rem}
    .sup-right{align-items:flex-start}
  }
`
