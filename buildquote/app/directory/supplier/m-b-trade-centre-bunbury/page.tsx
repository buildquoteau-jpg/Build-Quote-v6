import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'M&B Trade Centre Bunbury | Southwest WA Supplier Directory',
  description: 'M&B Sales is a distributor of quality building products in Western Australia with over 50 years experience. Located in Bunbury, supplying trade, builders and contractors across Southwest WA.',
}

const HOURS = {
  Monday: '7:00am – 4:00pm',
  Tuesday: '7:00am – 4:00pm',
  Wednesday: '7:00am – 4:00pm',
  Thursday: '7:00am – 4:00pm',
  Friday: '7:00am – 4:00pm',
  Saturday: 'Closed',
  Sunday: 'Closed',
}

const BRANDS = [
  'James Hardie', 'Hebel', 'CSR', 'BGC', 'Boral', 'Knauf',
  'Rondo', 'Stratco', 'Fletcher Insulation', 'Bradford', 'Selleys', 'Parchem',
]

const SERVICES = [
  { title: 'Trade Accounts', desc: 'Dedicated trade pricing, monthly invoicing, and account management for builders and contractors.' },
  { title: 'Project Quoting', desc: "Detailed material take-offs and project quotes. Bring your plans and we'll do the numbers." },
  { title: 'Delivery', desc: 'Site delivery across Bunbury and Southwest WA. Crane-truck delivery available for large orders.' },
  { title: 'Technical Advice', desc: '50+ years of product knowledge. Our team can advise on systems, specifications and installation.' },
  { title: 'Order Processing', desc: 'Fast turnaround on stock orders. Special orders and non-stock items sourced to order.' },
  { title: 'RFQ Integration', desc: 'Receive quote requests directly from builders via the BuildQuote platform.' },
]

function isOpenNow(): { open: boolean; todayLabel: string } {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
  const now = new Date()
  const dayName = days[now.getDay()] as keyof typeof HOURS
  const todayLabel = HOURS[dayName]
  if (todayLabel === 'Closed') return { open: false, todayLabel }
  const match = todayLabel.match(/(\d+):(\d+)(am|pm)\s*–\s*(\d+):(\d+)(am|pm)/i)
  if (!match) return { open: false, todayLabel }
  const toMins = (h: string, m: string, ap: string) => {
    let hr = parseInt(h)
    if (ap.toLowerCase() === 'pm' && hr !== 12) hr += 12
    if (ap.toLowerCase() === 'am' && hr === 12) hr = 0
    return hr * 60 + parseInt(m)
  }
  const cur = now.getHours() * 60 + now.getMinutes()
  const open = cur >= toMins(match[1], match[2], match[3]) && cur < toMins(match[4], match[5], match[6])
  return { open, todayLabel }
}

export default function MBBunburyPage() {
  const { open, todayLabel } = isOpenNow()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
  const todayName = days[new Date().getDay()]

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* NAV */}
        <nav className="nav">
          <div className="nav-left">
            <a href="/directory" className="nav-back">← Directory</a>
            <span className="nav-sep">/</span>
            <a href="/directory" className="nav-crumb">Bunbury</a>
          </div>
          <a href="/" className="nav-logo">BUILD<span>QUOTE</span></a>
        </nav>

        {/* HERO */}
        <header className="hero">
          <div className="hero-inner">
            <div className="hero-left">
              <div className="hero-tags">
                <span className="tag tag-trade">Trade</span>
                <span className="tag tag-cat">Building Supplies</span>
                <span className={`tag ${open ? 'tag-open' : 'tag-closed'}`}>
                  {open ? '● Open Now' : '● Closed'}
                </span>
              </div>
              <h1 className="hero-name">M&amp;B Trade Centre</h1>
              <p className="hero-location">Bunbury, Southwest WA</p>
              <p className="hero-desc">
                M&amp;B Sales has been supplying quality building products to Western Australian builders,
                contractors and tradies for over 50 years. Specialists in cladding, insulation, plasterboard,
                ceiling systems and architectural finishes.
              </p>
              <div className="hero-actions">
                <a href="/rfq" className="btn-rfq">
                  <span>Send Quote Request via BuildQuote</span>
                  <span className="btn-arrow">→</span>
                </a>
                <a href="tel:+61897248900" className="btn-call">📞 (08) 9724 8900</a>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-img-wrap">
                <img
                  src="https://lh3.googleusercontent.com/gps-cs-s/AHVAweqEWt7STjGGhvQMlQSJaKgEyAoWIJNePhwgNHGsk25EUalrpJiTxlGtojc1gCqN0nHbWc6UYJdrS6alf2TAFR2Z-h-ENpGBEJyfOnbFiJQKNWTokA32EJDeV_ksHx7CqJj15XysTER5NKob=w800-h500-k-no"
                  alt="M&B Trade Centre Bunbury"
                  className="hero-img"
                />
                <div className="hero-img-caption">50 McCombe Rd, Bunbury WA 6230</div>
              </div>
            </div>
          </div>
        </header>

        {/* QUICK INFO STRIP */}
        <div className="info-strip">
          <div className="info-item">
            <span className="info-label">Address</span>
            <span className="info-val">50 McCombe Rd, Davenport WA 6230</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone</span>
            <a href="tel:+61897248900" className="info-val info-link">(08) 9724 8900</a>
          </div>
          <div className="info-item">
            <span className="info-label">Website</span>
            <a href="https://mbsales.com.au" target="_blank" rel="noopener noreferrer" className="info-val info-link">mbsales.com.au ↗</a>
          </div>
          <div className="info-item">
            <span className="info-label">Today</span>
            <span className="info-val">{todayLabel}</span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="content">

          {/* ABOUT */}
          <section className="section">
            <h2 className="section-title">About</h2>
            <div className="about-grid">
              <div className="about-text">
                <p>M&amp;B Sales Pty Ltd is one of Western Australia's most trusted distributors of building products, with branches across the state including Bunbury, Busselton, Albany and Bayswater. The Bunbury Trade Centre serves builders and contractors across the Southwest WA region.</p>
                <p>Their product range spans everything from external cladding systems through to internal linings, acoustic insulation, ceiling systems and architectural panel products. The team's deep product knowledge means they can spec entire building envelopes — not just supply materials.</p>
                <p>M&amp;B works primarily with builders, construction companies, and trade contractors. They offer trade accounts with dedicated pricing, monthly invoicing, and direct liaison with sales reps for project quoting.</p>
              </div>
              <div className="about-stats">
                <div className="stat">
                  <span className="stat-num">50+</span>
                  <span className="stat-label">Years in Business</span>
                </div>
                <div className="stat">
                  <span className="stat-num">4</span>
                  <span className="stat-label">WA Branches</span>
                </div>
                <div className="stat">
                  <span className="stat-num">Trade</span>
                  <span className="stat-label">Primary Customer</span>
                </div>
                <div className="stat">
                  <span className="stat-num">SW WA</span>
                  <span className="stat-label">Delivery Coverage</span>
                </div>
              </div>
            </div>
          </section>

          {/* SERVICES */}
          <section className="section">
            <h2 className="section-title">Services</h2>
            <div className="services-grid">
              {SERVICES.map(s => (
                <div key={s.title} className="service-card">
                  <h3 className="service-name">{s.title}</h3>
                  <p className="service-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* BRANDS */}
          <section className="section">
            <h2 className="section-title">Brands Stocked</h2>
            <div className="brands-grid">
              {BRANDS.map(b => (
                <div key={b} className="brand-pill">{b}</div>
              ))}
            </div>
          </section>

          {/* HOURS */}
          <section className="section">
            <h2 className="section-title">Trading Hours</h2>
            <div className="hours-table">
              {(Object.entries(HOURS) as [string, string][]).map(([day, hours]) => (
                <div key={day} className={`hours-row${day === todayName ? ' today' : ''}`}>
                  <span className="hours-day">
                    {day === todayName && <span className="today-dot">●</span>}
                    {day}
                  </span>
                  <span className={`hours-time${hours === 'Closed' ? ' closed' : ''}`}>{hours}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RFQ CTA */}
          <section className="cta-section">
            <div className="cta-inner">
              <div className="cta-text">
                <h2 className="cta-title">Ready to Request a Quote?</h2>
                <p className="cta-desc">Use BuildQuote to send a structured material quote request directly to M&amp;B Trade Centre Bunbury. Stage your materials, specify quantities, and get the right information to your supplier first time.</p>
              </div>
              <div className="cta-actions">
                <a href="/rfq" className="cta-btn-primary">
                  Start Quote Request →
                </a>
                <a href="/directory" className="cta-btn-secondary">
                  ← Back to Directory
                </a>
              </div>
            </div>
          </section>

        </div>

        <footer className="page-footer">
          <span>© 2025 BuildQuote · Southwest WA Supplier Directory</span>
          <span>Listing data updated Feb 2026</span>
        </footer>
      </div>
    </>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --navy:#1e3a4a;--teal:#2e6b7a;--teal-l:#4a8fa0;--accent:#8cb8c4;
    --bg:#f8f6f2;--white:#ffffff;--ink:#1a2630;--ink2:#4a5e6a;--ink3:#8a9eaa;
    --sand:#b8a98a;--green:#2d7a5a;--border:#e2ddd6;
  }
  body{background:var(--bg);color:var(--ink)}
  .page{min-height:100vh;background:var(--bg);font-family:'Barlow',sans-serif}

  /* NAV */
  .nav{display:flex;justify-content:space-between;align-items:center;padding:1.2rem 3rem;background:var(--white);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100}
  .nav-left{display:flex;align-items:center;gap:0.6rem}
  .nav-back{font-family:'Barlow Condensed',sans-serif;font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--teal);text-decoration:none;transition:color 0.2s}
  .nav-back:hover{color:var(--navy)}
  .nav-sep{color:var(--ink3);font-size:0.8rem}
  .nav-crumb{font-family:'Barlow Condensed',sans-serif;font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--ink3);text-decoration:none}
  .nav-logo{font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:800;letter-spacing:0.15em;text-decoration:none;color:var(--navy)}
  .nav-logo span{color:var(--teal)}

  /* HERO */
  .hero{background:var(--white);border-bottom:1px solid var(--border);padding:3rem 3rem 0}
  .hero-inner{display:grid;grid-template-columns:1fr 420px;gap:3rem;align-items:start;max-width:1200px;margin:0 auto}
  .hero-tags{display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.2rem}
  .tag{font-family:'Barlow Condensed',sans-serif;font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;padding:0.25rem 0.7rem;border:1px solid}
  .tag-trade{border-color:rgba(74,143,160,0.4);color:var(--teal);background:rgba(74,143,160,0.06)}
  .tag-cat{border-color:var(--border);color:var(--ink2)}
  .tag-open{border-color:rgba(45,122,90,0.4);color:var(--green);background:rgba(45,122,90,0.06)}
  .tag-closed{border-color:var(--border);color:var(--ink3)}
  .hero-name{font-family:'Barlow Condensed',sans-serif;font-size:clamp(2.2rem,5vw,3.8rem);font-weight:800;text-transform:uppercase;line-height:1;color:var(--navy);margin-bottom:0.3rem}
  .hero-location{font-family:'Barlow Condensed',sans-serif;font-size:0.8rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--ink3);margin-bottom:1.2rem}
  .hero-desc{font-size:0.95rem;font-weight:300;color:var(--ink2);line-height:1.7;max-width:520px;margin-bottom:2rem}
  .hero-actions{display:flex;flex-wrap:wrap;gap:0.8rem;margin-bottom:3rem}
  .btn-rfq{display:inline-flex;align-items:center;gap:0.8rem;background:var(--navy);color:#f5f2ed;font-family:'Barlow Condensed',sans-serif;font-size:0.75rem;letter-spacing:0.18em;text-transform:uppercase;padding:0.9rem 1.5rem;text-decoration:none;transition:background 0.2s}
  .btn-rfq:hover{background:var(--teal)}
  .btn-arrow{font-size:1rem}
  .btn-call{display:inline-flex;align-items:center;gap:0.4rem;border:1.5px solid var(--navy);color:var(--navy);font-family:'Barlow Condensed',sans-serif;font-size:0.75rem;letter-spacing:0.18em;text-transform:uppercase;padding:0.9rem 1.5rem;text-decoration:none;transition:all 0.2s}
  .btn-call:hover{background:var(--navy);color:#f5f2ed}
  .hero-right{padding-bottom:0}
  .hero-img-wrap{position:relative}
  .hero-img{width:100%;height:280px;object-fit:cover;display:block}
  .hero-img-caption{font-size:0.7rem;color:var(--ink3);padding:0.5rem 0;letter-spacing:0.05em}

  /* INFO STRIP */
  .info-strip{background:var(--navy);display:grid;grid-template-columns:repeat(4,1fr);gap:0}
  .info-item{padding:1.2rem 2rem;border-right:1px solid rgba(255,255,255,0.08)}
  .info-item:last-child{border-right:none}
  .info-label{display:block;font-family:'Barlow Condensed',sans-serif;font-size:0.58rem;letter-spacing:0.28em;text-transform:uppercase;color:rgba(245,242,237,0.4);margin-bottom:0.3rem}
  .info-val{font-size:0.85rem;color:#f5f2ed;font-weight:400}
  .info-link{text-decoration:none;color:#8cb8c4;transition:color 0.2s}
  .info-link:hover{color:#f5f2ed}

  /* CONTENT */
  .content{max-width:1100px;margin:0 auto;padding:3rem 3rem 2rem}
  .section{margin-bottom:4rem}
  .section-title{font-family:'Barlow Condensed',sans-serif;font-size:1.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--navy);margin-bottom:1.5rem;padding-bottom:0.8rem;border-bottom:2px solid var(--navy)}

  /* ABOUT */
  .about-grid{display:grid;grid-template-columns:1fr 240px;gap:3rem;align-items:start}
  .about-text{display:flex;flex-direction:column;gap:1rem}
  .about-text p{font-size:0.9rem;color:var(--ink2);line-height:1.75}
  .about-stats{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border)}
  .stat{background:var(--white);padding:1.2rem;text-align:center}
  .stat-num{display:block;font-family:'Barlow Condensed',sans-serif;font-size:1.6rem;font-weight:800;color:var(--navy);line-height:1}
  .stat-label{display:block;font-size:0.65rem;color:var(--ink3);letter-spacing:0.1em;text-transform:uppercase;margin-top:0.2rem}

  /* SERVICES */
  .services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border)}
  .service-card{background:var(--white);padding:1.5rem}
  .service-name{font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--navy);margin-bottom:0.5rem}
  .service-desc{font-size:0.8rem;color:var(--ink2);line-height:1.6}

  /* BRANDS */
  .brands-grid{display:flex;flex-wrap:wrap;gap:0.5rem}
  .brand-pill{font-family:'Barlow Condensed',sans-serif;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;padding:0.4rem 0.9rem;border:1.5px solid var(--border);color:var(--ink2);background:var(--white);transition:all 0.18s}
  .brand-pill:hover{border-color:var(--teal);color:var(--teal)}

  /* HOURS */
  .hours-table{display:flex;flex-direction:column;gap:0;max-width:400px;border:1px solid var(--border)}
  .hours-row{display:flex;justify-content:space-between;align-items:center;padding:0.7rem 1rem;border-bottom:1px solid var(--border);background:var(--white)}
  .hours-row:last-child{border-bottom:none}
  .hours-row.today{background:rgba(46,107,122,0.05);border-left:3px solid var(--teal)}
  .hours-day{font-size:0.85rem;color:var(--ink);display:flex;align-items:center;gap:0.5rem}
  .today-dot{color:var(--teal);font-size:0.5rem}
  .hours-time{font-size:0.85rem;color:var(--ink2)}
  .hours-time.closed{color:var(--ink3)}

  /* CTA */
  .cta-section{background:var(--navy);padding:3rem;margin-top:2rem}
  .cta-inner{display:grid;grid-template-columns:1fr auto;gap:3rem;align-items:center;max-width:1100px;margin:0 auto}
  .cta-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:800;text-transform:uppercase;color:#f5f2ed;margin-bottom:0.8rem}
  .cta-desc{font-size:0.85rem;font-weight:300;color:rgba(245,242,237,0.6);line-height:1.7;max-width:520px}
  .cta-actions{display:flex;flex-direction:column;gap:0.6rem;min-width:220px}
  .cta-btn-primary{display:block;background:#f5f2ed;color:var(--navy);font-family:'Barlow Condensed',sans-serif;font-size:0.75rem;letter-spacing:0.18em;text-transform:uppercase;padding:1rem 1.5rem;text-decoration:none;text-align:center;transition:all 0.2s}
  .cta-btn-primary:hover{background:var(--accent);color:var(--navy)}
  .cta-btn-secondary{display:block;border:1px solid rgba(245,242,237,0.25);color:rgba(245,242,237,0.6);font-family:'Barlow Condensed',sans-serif;font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;padding:0.8rem 1.5rem;text-decoration:none;text-align:center;transition:all 0.2s}
  .cta-btn-secondary:hover{border-color:rgba(245,242,237,0.5);color:#f5f2ed}

  /* FOOTER */
  .page-footer{display:flex;justify-content:space-between;padding:1.2rem 3rem;border-top:1px solid var(--border);font-size:0.6rem;letter-spacing:0.15em;color:var(--ink3);text-transform:uppercase;background:var(--white)}

  /* RESPONSIVE */
  @media(max-width:900px){
    .hero-inner{grid-template-columns:1fr}
    .hero-right{display:none}
    .info-strip{grid-template-columns:1fr 1fr}
    .about-grid{grid-template-columns:1fr}
    .services-grid{grid-template-columns:1fr 1fr}
    .cta-inner{grid-template-columns:1fr}
  }
  @media(max-width:600px){
    .nav,.hero,.content,.cta-section,.page-footer{padding-left:1.5rem;padding-right:1.5rem}
    .info-strip{grid-template-columns:1fr}
    .info-item{border-right:none;border-bottom:1px solid rgba(255,255,255,0.08)}
    .services-grid{grid-template-columns:1fr}
    .hero-actions{flex-direction:column}
    .btn-rfq,.btn-call{justify-content:center}
  }
`
