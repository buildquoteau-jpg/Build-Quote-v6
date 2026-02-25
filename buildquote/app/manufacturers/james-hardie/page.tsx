'use client'
import { useState } from 'react'
import manufacturersData from '@/data/manufacturers.json'

const jh = (manufacturersData as any[]).find(m => m.slug === 'james-hardie')

const APPLICATION_COLOURS: Record<string, string> = {
  'External Cladding': '#4a8fa0',
  'Internal Lining': '#b8a98a',
  'Flooring': '#7ec8a0',
}

export default function JamesHardiePage() {
  const [query, setQuery] = useState('')
  const filtered = query.trim()
    ? jh.systems.filter((s: any) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.application?.toLowerCase().includes(query.toLowerCase()) ||
        s.description?.toLowerCase().includes(query.toLowerCase())
      )
    : jh.systems

  return (
    <>
      <style>{css}</style>
      <div className="jh">
        <nav className="jh-nav">
          <button className="back-btn" onClick={() => window.history.back()}>← Manufacturers</button>
          <a href="/portfolio" className="logo-sm">BUILD<span>QUOTE</span></a>
        </nav>

        <div className="jh-hero">
          <p className="eyebrow">Manufacturer</p>
          <h1 className="jh-title">{jh.name}</h1>
          <p className="jh-desc">{jh.description}</p>
          <div className="jh-links">
            <a href={jh.website} target="_blank" rel="noopener noreferrer" className="jh-link-btn primary">
              Visit Website ↗
            </a>
            <a href={`tel:${jh.phone}`} className="jh-link-btn secondary">
              📞 {jh.phone}
            </a>
          </div>
          <div className="disclaimer">
            <span className="disc-icon">⚠</span>
            <p>Component cards are compiled using AI and publicly available manufacturer data.
            Always verify product codes, specifications and compatibility on the
            manufacturer&apos;s website before placing your order. Install guides and
            technical data sheets are available directly from the manufacturer.</p>
          </div>
        </div>

        <div className="systems-section">
          <p className="section-label">Systems — {filtered.length} of {jh.systems.length} available</p>
          <div className="jh-search">
            <input
              className="jh-search-input"
              type="text"
              placeholder="Search systems..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="systems-grid">
            {filtered.map((sys: any) => (
              <a key={sys.slug} href={`/manufacturers/james-hardie/${sys.slug}`} className="sys-card">
                <div className="sys-card-top">
                  <span className="sys-app" style={{ color: APPLICATION_COLOURS[sys.application] || '#4a8fa0', borderColor: APPLICATION_COLOURS[sys.application] || '#4a8fa0' }}>
                    {sys.application}
                  </span>
                  <span className="sys-warranty">{sys.warranty} warranty</span>
                </div>
                <h2 className="sys-name">{sys.name}</h2>
                <p className="sys-desc">{sys.description}</p>
                <div className="sys-card-foot">
                  <div className="sys-stats">
                    <span className="sys-stat"><span className="stat-label">Thickness</span>{sys.thickness}</span>
                    <span className="sys-stat"><span className="stat-label">Panels</span>{sys.panels.length} SKUs</span>
                    <span className="sys-stat"><span className="stat-label">Accessories</span>{sys.accessories.length} SKUs</span>
                  </div>
                  <span className="sys-arrow">↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <footer className="jh-footer">© 2025 BuildQuote · Manufacturer Portal</footer>
      </div>
    </>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;800&family=Barlow:wght@300;400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--teal-l:#4a8fa0;--accent:#8cb8c4;--white:#f5f2ed;--bg:#0f1e26;--sand:#b8a98a}
  body{background:var(--bg)}
  .jh{min-height:100vh;background:var(--bg);font-family:'Barlow',sans-serif;color:var(--white)}
  .jh-nav{display:flex;justify-content:space-between;align-items:center;padding:1.2rem 3rem;border-bottom:1px solid rgba(74,143,160,0.2);position:sticky;top:0;background:rgba(15,30,38,0.96);backdrop-filter:blur(10px);z-index:100}
  .back-btn{font-family:'Barlow Condensed',sans-serif;font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,242,237,0.45);background:none;border:none;cursor:pointer;transition:color 0.2s}
  .back-btn:hover{color:var(--accent)}
  .logo-sm{font-family:'Barlow Condensed',sans-serif;font-size:1.1rem;font-weight:800;letter-spacing:0.15em;text-decoration:none;color:var(--white)}
  .logo-sm span{color:var(--accent)}
  .jh-hero{padding:3rem 3rem 2rem;max-width:800px}
  .eyebrow{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;letter-spacing:0.38em;color:var(--accent);text-transform:uppercase;margin-bottom:0.8rem}
  .jh-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:800;text-transform:uppercase;line-height:1;margin-bottom:1rem}
  .jh-desc{font-size:0.88rem;font-weight:300;color:rgba(245,242,237,0.5);line-height:1.7;max-width:520px;margin-bottom:1.5rem}
  .jh-links{display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1.5rem}
  .jh-link-btn{font-family:'Barlow Condensed',sans-serif;font-size:0.7rem;letter-spacing:0.18em;text-transform:uppercase;padding:0.55rem 1.1rem;border:1px solid;text-decoration:none;transition:all 0.18s}
  .jh-link-btn.primary{border-color:rgba(140,184,196,0.5);color:var(--accent);background:rgba(140,184,196,0.08)}
  .jh-link-btn.primary:hover{background:rgba(140,184,196,0.18);border-color:var(--accent)}
  .jh-link-btn.secondary{border-color:rgba(126,200,160,0.38);color:#7ec8a0}
  .jh-link-btn.secondary:hover{background:rgba(126,200,160,0.1);border-color:#7ec8a0}
  .disclaimer{display:flex;gap:0.75rem;align-items:flex-start;background:rgba(184,169,138,0.08);border:1px solid rgba(184,169,138,0.25);border-left:3px solid var(--sand);padding:1rem 1.25rem;max-width:600px}
  .disc-icon{font-size:0.9rem;color:var(--sand);flex-shrink:0;margin-top:0.05rem}
  .disclaimer p{font-size:0.75rem;color:rgba(245,242,237,0.45);line-height:1.6}
  .systems-section{padding:2rem 3rem 4rem}
  .section-label{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;letter-spacing:0.4em;color:rgba(245,242,237,0.3);text-transform:uppercase;margin-bottom:2rem;padding-bottom:0.8rem;border-bottom:1px solid rgba(74,143,160,0.15)}
  .systems-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1px}
  .sys-card{background:rgba(30,58,74,0.4);border:1px solid rgba(74,143,160,0.12);padding:2rem;display:flex;flex-direction:column;gap:0.9rem;position:relative;overflow:hidden;transition:background 0.22s,border-color 0.22s,transform 0.2s;text-decoration:none;color:inherit}
  .sys-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:0;background:var(--teal-l);transition:height 0.3s}
  .sys-card:hover{background:rgba(46,107,122,0.2);border-color:rgba(74,143,160,0.3);transform:translateY(-2px)}
  .sys-card:hover::before{height:100%}
  .sys-card-top{display:flex;justify-content:space-between;align-items:center}
  .sys-app{font-family:'Barlow Condensed',sans-serif;font-size:0.58rem;letter-spacing:0.18em;text-transform:uppercase;padding:0.2rem 0.5rem;border:1px solid}
  .sys-warranty{font-family:'Barlow Condensed',sans-serif;font-size:0.58rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(245,242,237,0.28)}
  .sys-name{font-family:'Barlow Condensed',sans-serif;font-size:1.6rem;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;line-height:1}
  .sys-desc{font-size:0.78rem;font-weight:300;color:rgba(245,242,237,0.45);line-height:1.6;flex:1}
  .sys-card-foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:0.5rem}
  .sys-stats{display:flex;flex-direction:column;gap:0.25rem}
  .sys-stat{font-size:0.72rem;color:rgba(245,242,237,0.4);display:flex;gap:0.5rem}
  .stat-label{font-family:'Barlow Condensed',sans-serif;font-size:0.58rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(245,242,237,0.22);min-width:70px}
  .sys-arrow{font-size:1.2rem;color:rgba(245,242,237,0.15);transition:color 0.2s,transform 0.2s;align-self:flex-end}
  .sys-card:hover .sys-arrow{color:var(--accent);transform:translate(3px,-3px)}
  .jh-footer{padding:1.2rem 3rem;border-top:1px solid rgba(74,143,160,0.1);font-size:0.6rem;letter-spacing:0.14em;color:rgba(245,242,237,0.2);text-transform:uppercase}

  .jh-search{margin-bottom:1.5rem}
  .jh-search-input{width:100%;max-width:400px;background:rgba(30,58,74,0.5);border:1px solid rgba(74,143,160,0.2);color:var(--white);font-family:'Barlow',sans-serif;font-size:0.88rem;padding:0.65rem 1rem;outline:none;transition:border-color 0.2s}
  .jh-search-input::placeholder{color:rgba(245,242,237,0.25)}
  .jh-search-input:focus{border-color:var(--accent)}
  @media(max-width:680px){
    .jh-nav,.jh-hero,.systems-section,.jh-footer{padding-left:1.5rem;padding-right:1.5rem}
    .systems-grid{grid-template-columns:1fr}
    .jh-links{flex-direction:column}
    .jh-link-btn{text-align:center}
  }
`
