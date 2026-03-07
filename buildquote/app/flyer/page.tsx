export default function FlyerPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#ffffff', color: '#1a2535', fontFamily: 'Arial, Helvetica, sans-serif' }}>

      {/* ── HERO ── */}
      <section style={{ backgroundColor: '#1a2535' }} className="px-6 py-12 text-center">
        <div className="mb-3" style={{ color: '#f97316', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Request for Quotation, Made Simple
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>
          Build<span style={{ color: '#f97316' }}>Quote</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.6rem)', fontWeight: 800, color: '#ffffff', marginTop: '1.25rem', lineHeight: 1.2 }}>
          Turn your materials list into<br />
          a <span style={{ color: '#f97316' }}>professional quote request</span><br />
          in under a minute.
        </h1>
        <p style={{ color: '#d1d5db', marginTop: '1rem', fontSize: '1.05rem', maxWidth: '480px', margin: '1rem auto 0' }}>
          Snap a photo. Upload any file. BuildQuote reads it and sends a clean RFQ PDF straight to your supplier.
        </p>
        
        <a href="https://buildquote.com.au"
          style={{
            display: 'inline-block',
            marginTop: '1.75rem',
            backgroundColor: '#f97316',
            color: '#ffffff',
            fontWeight: 700,
            padding: '0.85rem 2rem',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            fontSize: '1rem',
          }}
        >
          Try it free — buildquote.com.au →
        </a>
        <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.75rem' }}>
          No account needed · Free to use · Built for WA builders
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ backgroundColor: '#f9fafb', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ color: '#f97316', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.5rem' }}>
            How it works
          </div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, textAlign: 'center', color: '#1a2535', marginBottom: '2.5rem' }}>
            Four steps. No faff.
          </h2>

          {/* Image 1 — handwritten list */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              borderRadius: '0.75rem',
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
              aspectRatio: '16/7',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/handwritten-list.jpg"
                alt="Handwritten materials list — Garage Roof"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          </div>

          {/* Steps */}
          {[
            {
              num: '01',
              title: 'Start with any list',
              desc: 'Handwritten note, site pad, spreadsheet, or PDF. No special format required — if you can read it, BuildQuote can too.',
            },
            {
              num: '02',
              title: 'Upload to BuildQuote',
              desc: 'Drop your file or photo at buildquote.com.au. AI reads every line item automatically — no re-keying.',
            },
            {
              num: '03',
              title: 'Review and edit',
              desc: 'Check quantities, specs, and descriptions. Add anything that was missed. Takes seconds.',
            },
            {
              num: '04',
              title: 'Send to your supplier',
              desc: 'Supplier receives a clean, professional RFQ PDF with your details, their details, and every line item clearly listed.',
            },
          ].map((step) => (
            <div
              key={step.num}
              style={{
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{
                flexShrink: 0,
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                backgroundColor: '#1a2535',
                color: '#f97316',
                fontWeight: 900,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {step.num}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a2535', marginBottom: '0.25rem' }}>
                  {step.title}
                </div>
                <div style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}

          {/* Image 2 — generated PDF */}
          <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ color: '#6b7280', fontSize: '0.75rem', textAlign: 'center', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              What your supplier receives
            </div>
            <div style={{
              borderRadius: '0.75rem',
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
              aspectRatio: '3/4',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '420px',
              margin: '0 auto',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/rfq-pdf-sample.png"
                alt="Sample RFQ PDF sent to supplier"
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── WHY BUILDQUOTE ── */}
      <section style={{ backgroundColor: '#ffffff', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ color: '#f97316', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.5rem' }}>
            Why BuildQuote
          </div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, textAlign: 'center', color: '#1a2535', marginBottom: '2rem' }}>
            Built for the way builders actually work.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '📋', title: 'Any list format works', text: 'Handwritten note, phone photo, spreadsheet, PDF. BuildQuote reads them all. No reformatting, no re-keying.' },
              { icon: '⚡', title: 'Done in under a minute', text: 'Upload, review, send. No account setup, no learning curve. Get your quote request out while you\'re still on site.' },
              { icon: '📄', title: 'Professional every time', text: 'Suppliers receive a structured RFQ PDF with your details, their details, and every line item clearly laid out.' },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.6rem' }}>{card.icon}</div>
                <div style={{ fontWeight: 700, color: '#1a2535', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{card.title}</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.5 }}>{card.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ backgroundColor: '#1a2535', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
          Ready to send your first<br />
          <em style={{ color: '#f97316', fontStyle: 'normal' }}>quote request?</em>
        </h2>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Built for WA builders. Free to use. No account needed.</p>
        
        <a href="https://buildquote.com.au"
          style={{
            display: 'inline-block',
            backgroundColor: '#f97316',
            color: '#ffffff',
            fontWeight: 700,
            padding: '0.85rem 2rem',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            fontSize: '1rem',
          }}
        >
          Start your RFQ →
        </a>
        <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '1rem' }}>
          buildquote.com.au · Request for Quotation, Made Simple
        </div>
      </section>

    </main>
  );
}
