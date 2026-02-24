'use client'

const projects = [
  {
    num: '01', tag: 'Core Platform', title: 'BuildQuote',
    desc: 'AI-native quote request platform. Stage-based material coordination connecting builders and suppliers across Southwest WA.',
    status: 'active', statusLabel: 'Active Development', href: '/rfq',
  },
  {
    num: '02', tag: 'Directory', title: 'SW Supplier Directory',
    desc: 'Comprehensive supplier directory for the Southwest WA construction industry. SEO-driven with BuildQuote integration.',
    status: 'building', statusLabel: 'Building', href: '/directory',
  },
  {
    num: '03', tag: 'Portal', title: 'Manufacturers Portal',
    desc: 'Dedicated portal for manufacturers to manage listings, respond to quotes, and connect with builders directly.',
    status: 'building', statusLabel: 'Building', href: '#',
  },
  {
    num: '04', tag: 'Fabrication', title: 'Southwest Shelters',
    desc: 'Website for a Southwest WA fabrication company specialising in steel, timber, and aluminium shelters and boardwalks.',
    status: 'building', statusLabel: 'Building', href: '#',
  },
  {
    num: '05', tag: 'Coming Soon', title: 'More Apps',
    desc: 'Additional tools and experiments in the pipeline. This space will expand as new projects come online.',
    status: 'planned', statusLabel: 'Planned', href: '#',
  },
]

export default function PortfolioPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800&family=Barlow:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #1e3a4a; --teal: #2e6b7a; --teal-light: #4a8fa0;
          --accent: #8cb8c4; --white: #f5f2ed; --sand: #b8a98a;
        }
        html, body { background: #0f1e26; }
        .dash { background: #0f1e26; min-height: 100vh; font-family: 'Barlow', sans-serif; color: var(--white); }
        .dash-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 2rem 3rem;
          border-bottom: 1px solid rgba(74,143,160,0.2);
          position: sticky; top: 0;
          background: rgba(15,30,38,0.95);
          backdrop-filter: blur(10px); z-index: 100;
        }
        .dash-wm-main { font-family: 'Barlow Condensed', sans-serif; font-size: 1.4rem; font-weight: 800; letter-spacing: 0.2em; }
        .dash-wm-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 0.55rem; font-weight: 300; letter-spacing: 0.4em; color: var(--accent); display: block; }
        .dash-exit {
          font-family: 'Barlow Condensed', sans-serif; font-size: 0.7rem;
          letter-spacing: 0.2em; color: rgba(245,242,237,0.4);
          text-transform: uppercase; cursor: pointer;
          background: none; border: none;
          transition: color 0.2s; text-decoration: none;
        }
        .dash-exit:hover { color: var(--accent); }
        .dash-hero { padding: 5rem 3rem 3rem; max-width: 900px; }
        .dash-eyebrow { font-family: 'Barlow Condensed', sans-serif; font-size: 0.7rem; letter-spacing: 0.4em; color: var(--accent); text-transform: uppercase; margin-bottom: 1rem; }
        .dash-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 800; line-height: 0.95; text-transform: uppercase; margin-bottom: 1.5rem; }
        .dash-desc { font-size: 0.95rem; font-weight: 300; color: rgba(245,242,237,0.6); line-height: 1.7; max-width: 480px; }
        .projects-section { padding: 2rem 3rem 5rem; }
        .section-label { font-family: 'Barlow Condensed', sans-serif; font-size: 0.65rem; letter-spacing: 0.4em; color: rgba(245,242,237,0.3); text-transform: uppercase; margin-bottom: 2rem; padding-bottom: 0.8rem; border-bottom: 1px solid rgba(74,143,160,0.15); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5px; }
        .card {
          background: rgba(30,58,74,0.4); border: 1px solid rgba(74,143,160,0.12);
          padding: 2.5rem 2rem; cursor: pointer;
          transition: background 0.25s, border-color 0.25s, transform 0.25s;
          text-decoration: none; color: inherit; display: block; position: relative; overflow: hidden;
        }
        .card::before { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 0; background: var(--teal-light); transition: height 0.3s ease; }
        .card:hover { background: rgba(46,107,122,0.2); border-color: rgba(74,143,160,0.3); transform: translateY(-2px); }
        .card:hover::before { height: 100%; }
        .card-tag { font-family: 'Barlow Condensed', sans-serif; font-size: 0.6rem; letter-spacing: 0.35em; color: var(--accent); text-transform: uppercase; margin-bottom: 1rem; }
        .card-num { font-family: 'Barlow Condensed', sans-serif; font-size: 3.5rem; font-weight: 800; color: rgba(74,143,160,0.15); line-height: 1; position: absolute; top: 1.5rem; right: 1.5rem; }
        .card-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(1.3rem, 2.5vw, 1.8rem); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.8rem; line-height: 1.1; }
        .card-desc { font-size: 0.82rem; font-weight: 300; color: rgba(245,242,237,0.55); line-height: 1.6; margin-bottom: 1.8rem; }
        .card-status { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Barlow Condensed', sans-serif; font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(245,242,237,0.4); }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(245,242,237,0.2); }
        .dot.active { background: #7ec8a0; box-shadow: 0 0 6px rgba(126,200,160,0.5); }
        .dot.building { background: var(--sand); }
        .card-arrow { position: absolute; bottom: 1.5rem; right: 1.5rem; font-size: 1.4rem; color: rgba(245,242,237,0.15); transition: color 0.2s, transform 0.2s; }
        .card:hover .card-arrow { color: var(--accent); transform: translate(3px, -3px); }
        @media (max-width: 680px) {
          .dash-nav, .projects-section, .dash-hero { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
      `}</style>

      <div className="dash">
        <nav className="dash-nav">
          <div>
            <span className="dash-wm-main">BUILDQUOTE</span>
            <span className="dash-wm-sub">Portfolio</span>
          </div>
          <a href="/" className="dash-exit">← Exit</a>
        </nav>

        <div className="dash-hero">
          <p className="dash-eyebrow">Work in Progress</p>
          <h2 className="dash-title">Construction<br />Tech Suite</h2>
          <p className="dash-desc">A collection of AI-native tools being built for the Australian construction industry. Each app is independently developed and progressively integrated.</p>
        </div>

        <div className="projects-section">
          <p className="section-label">Projects — 2025</p>
          <div className="grid">
            {projects.map(p => (
              <a key={p.num} href={p.href} className="card">
                <span className="card-num">{p.num}</span>
                <p className="card-tag">{p.tag}</p>
                <h3 className="card-title">{p.title}</h3>
                <p className="card-desc">{p.desc}</p>
                <span className="card-status">
                  <span className={`dot ${p.status}`} />
                  {p.statusLabel}
                </span>
                <span className="card-arrow">&#8599;</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
