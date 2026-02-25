'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import manufacturersData from '@/data/manufacturers.json'

const manufacturers = manufacturersData as any[]

function AddSystemContent() {
  const searchParams = useSearchParams()
  const mfrSlug = searchParams.get('manufacturer') || ''
  const mfr = manufacturers.find(m => m.slug === mfrSlug)

  return (
    <>
      <style>{css}</style>
      <div className="add">
        <nav className="add-nav">
          <button className="back-btn" onClick={() => window.history.back()}>
            ← {mfr ? mfr.name : 'Manufacturers'}
          </button>
          <a href="/portfolio" className="logo-sm">BUILD<span>QUOTE</span></a>
        </nav>

        <div className="add-hero">
          <p className="eyebrow">{mfr ? mfr.category : 'Manufacturer Portal'}</p>
          <h1 className="add-title">Add a System</h1>
          {mfr && <p className="add-sub">Adding to <strong>{mfr.name}</strong></p>}
          <p className="add-desc">
            Paste a product page URL or upload a brochure PDF and AI will extract the system details
            for you to review before it goes live.
          </p>
          <div className="disclaimer">
            <span className="disc-icon">⚠</span>
            <p>AI-parsed component cards must be verified against the manufacturer&apos;s website
            before use. All submissions go live immediately and are tagged as community-added.
            Always check product codes and specifications directly with the manufacturer.</p>
          </div>
        </div>

        <div className="add-body">
          <div className="coming-soon-card">
            <div className="cs-icon">🏗️</div>
            <h2 className="cs-title">AI Parse — Coming Soon</h2>
            <p className="cs-desc">
              Paste a manufacturer product page URL and AI will extract panels, accessories,
              product codes and dimensions into a component card ready for review.
            </p>
            <div className="cs-steps">
              <div className="cs-step"><span className="step-num">01</span><span>Paste product page URL or upload PDF brochure</span></div>
              <div className="cs-step"><span className="step-num">02</span><span>AI extracts system name, panels, accessories and product codes</span></div>
              <div className="cs-step"><span className="step-num">03</span><span>Review the component card — edit anything that looks wrong</span></div>
              <div className="cs-step"><span className="step-num">04</span><span>Confirm and it goes live for all builders to use</span></div>
            </div>
            {mfr?.website && (
              <p className="cs-hint">
                In the meantime, visit{' '}
                <a href={mfr.website} target="_blank" rel="noopener noreferrer" className="cs-link">
                  {mfr.website.replace('https://', '')} ↗
                </a>{' '}
                to find product pages and brochures.
              </p>
            )}
          </div>
        </div>

        <footer className="add-footer">© 2025 BuildQuote · Manufacturer Portal</footer>
      </div>
    </>
  )
}

export default function AddSystemPage() {
  return (
    <Suspense>
      <AddSystemContent />
    </Suspense>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;800&family=Barlow:wght@300;400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--teal-l:#4a8fa0;--accent:#8cb8c4;--white:#f5f2ed;--bg:#0f1e26;--sand:#b8a98a}
  body{background:var(--bg)}
  .add{min-height:100vh;background:var(--bg);font-family:'Barlow',sans-serif;color:var(--white)}
  .add-nav{display:flex;justify-content:space-between;align-items:center;padding:1.2rem 3rem;border-bottom:1px solid rgba(74,143,160,0.2);position:sticky;top:0;background:rgba(15,30,38,0.96);backdrop-filter:blur(10px);z-index:100}
  .back-btn{font-family:'Barlow Condensed',sans-serif;font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,242,237,0.45);background:none;border:none;cursor:pointer;transition:color 0.2s}
  .back-btn:hover{color:var(--accent)}
  .logo-sm{font-family:'Barlow Condensed',sans-serif;font-size:1.1rem;font-weight:800;letter-spacing:0.15em;text-decoration:none;color:var(--white)}
  .logo-sm span{color:var(--accent)}
  .add-hero{padding:3rem 3rem 2rem;max-width:800px}
  .eyebrow{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;letter-spacing:0.38em;color:var(--accent);text-transform:uppercase;margin-bottom:0.8rem}
  .add-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:800;text-transform:uppercase;line-height:1;margin-bottom:0.75rem}
  .add-sub{font-family:'Barlow Condensed',sans-serif;font-size:1rem;letter-spacing:0.1em;color:var(--accent);text-transform:uppercase;margin-bottom:0.75rem}
  .add-desc{font-size:0.88rem;font-weight:300;color:rgba(245,242,237,0.5);line-height:1.7;max-width:520px;margin-bottom:1.5rem}
  .disclaimer{display:flex;gap:0.75rem;align-items:flex-start;background:rgba(184,169,138,0.08);border:1px solid rgba(184,169,138,0.25);border-left:3px solid var(--sand);padding:1rem 1.25rem;max-width:600px}
  .disc-icon{font-size:0.9rem;color:var(--sand);flex-shrink:0;margin-top:0.05rem}
  .disclaimer p{font-size:0.75rem;color:rgba(245,242,237,0.45);line-height:1.6}
  .add-body{padding:2rem 3rem 4rem;max-width:680px}
  .coming-soon-card{background:rgba(30,58,74,0.4);border:1px solid rgba(74,143,160,0.15);padding:2.5rem;display:flex;flex-direction:column;gap:1.25rem}
  .cs-icon{font-size:2rem}
  .cs-title{font-family:'Barlow Condensed',sans-serif;font-size:1.6rem;font-weight:800;letter-spacing:0.05em;text-transform:uppercase}
  .cs-desc{font-size:0.85rem;font-weight:300;color:rgba(245,242,237,0.5);line-height:1.7}
  .cs-steps{display:flex;flex-direction:column;gap:0.75rem;margin-top:0.5rem}
  .cs-step{display:flex;gap:1rem;align-items:flex-start;font-size:0.82rem;color:rgba(245,242,237,0.45);line-height:1.5}
  .step-num{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;letter-spacing:0.2em;color:var(--accent);background:rgba(74,143,160,0.1);border:1px solid rgba(74,143,160,0.2);padding:0.15rem 0.4rem;flex-shrink:0;margin-top:0.1rem}
  .cs-hint{font-size:0.78rem;color:rgba(245,242,237,0.35);line-height:1.6;margin-top:0.5rem;padding-top:1rem;border-top:1px solid rgba(74,143,160,0.1)}
  .cs-link{color:var(--accent);text-decoration:none}
  .cs-link:hover{text-decoration:underline}
  .add-footer{padding:1.2rem 3rem;border-top:1px solid rgba(74,143,160,0.1);font-size:0.6rem;letter-spacing:0.14em;color:rgba(245,242,237,0.2);text-transform:uppercase}
  @media(max-width:680px){
    .add-nav,.add-hero,.add-body,.add-footer{padding-left:1.5rem;padding-right:1.5rem}
  }
`
