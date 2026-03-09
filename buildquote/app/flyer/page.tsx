export default function FlyerPage() {
  return (
    <div className="min-h-screen font-sans antialiased">

      {/* TOP BAR */}
      <div className="bg-slate-900 px-6 sm:px-16 py-4 flex items-center justify-between">
        <div className="text-xl font-extrabold tracking-tight text-white">
          Build<span className="text-orange-500">Quote</span>
        </div>
        <div className="text-xs text-slate-200 font-mono">buildquote.com.au</div>
      </div>

      {/* HERO */}
      <div className="bg-slate-800 px-6 sm:px-16 pt-12 pb-12 text-white">
        <div className="inline-flex items-center bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-6">
          Built for Southwest WA Builders
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4 max-w-2xl">
          Turn your materials list into a{' '}
          <em className="not-italic text-orange-500">supplier-ready RFQ.</em>
        </h1>
        <p className="text-slate-200 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
          Upload a photo, spreadsheet, or handwritten note. BuildQuote reads it, structures every line item, and sends a professional Request for Quotation to your preferred supplier.
        </p>
        <div className="flex flex-wrap gap-2 mb-10">
          {['📸 Photo', '📊 Excel', '📋 Handwritten', '📄 PDF', '📝 Word'].map((label) => (
            <span key={label} className="bg-white/5 border border-white/10 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-md">
              {label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-6 max-w-2xl">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold tracking-widest uppercase text-slate-200 mb-2">Your list</div>
            <div className="rounded-xl border border-white/10 overflow-hidden aspect-[4/3] bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/handwritten-list.jpg" alt="Handwritten materials list" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-extrabold text-white">BQ</div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold tracking-widest uppercase text-slate-200 mb-2">Supplier-ready RFQ</div>
            <div className="rounded-xl border border-white/10 overflow-hidden aspect-[4/3] bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/rfq-pdf-sample.png" alt="Generated RFQ PDF" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <a href="https://buildquote.com.au/" className="inline-flex items-center gap-2 bg-orange-500 text-white text-base font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-orange-500/30 hover:opacity-90 transition-opacity">
            Try BuildQuote Free &nbsp;&rarr;
          </a>
          <div className="text-xs text-slate-200 mt-3">No account needed &nbsp;&middot;&nbsp; Takes 60 seconds</div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-white px-6 sm:px-16 py-12">
        <div className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-2">How it works</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-8">Four steps. Done in under a minute.</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { n: '01', title: 'Start with any list', desc: 'Handwritten note, site pad, spreadsheet, or PDF. No special format required.' },
            { n: '02', title: 'Upload to BuildQuote', desc: 'Drop any file. AI reads it and pulls out every line item automatically.' },
            { n: '03', title: 'Review and edit', desc: 'Check quantities, specs, and descriptions. Add anything that was missed.' },
            { n: '04', title: 'Send to your supplier', desc: 'Supplier receives a clean PDF with every item clearly listed. Done.' },
          ].map((step) => (
            <div key={step.n} className="flex flex-col gap-2 p-6 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-orange-500 tracking-widest uppercase mb-1">Step {step.n}</div>
              <div className="text-base font-bold text-slate-900">{step.title}</div>
              <div className="text-sm text-slate-600 leading-relaxed">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY BUILDQUOTE */}
      <div className="bg-slate-50 px-6 sm:px-16 py-12 border-t border-slate-200">
        <div className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-2">Why BuildQuote</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-8">Built for the way builders actually work.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: 'Any list format works', text: 'Handwritten note, phone photo, spreadsheet, PDF — BuildQuote reads them all. No reformatting, no re-keying.' },
            { title: 'Under a minute', text: "Upload. Review. Send. Get your RFQ out while you're still on site. Simple." },
            { title: 'Professional every time', text: 'Suppliers get a clean PDF with your business details, your project details, and every line item clearly laid out.' },
          ].map((card) => (
            <div key={card.title} className="border-t-4 border-orange-500 bg-white rounded-b-xl px-5 py-5 shadow-sm">
              <div className="text-base font-bold text-slate-900 mb-2">{card.title}</div>
              <div className="text-sm text-slate-700 leading-relaxed">{card.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER CTA */}
      <div className="bg-slate-900 px-6 py-14 text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-3">
          Ready to send your first <em className="not-italic text-orange-500">quote request?</em>
        </h2>
        <p className="text-sm text-slate-300 mb-6 max-w-sm mx-auto">Built for WA builders. Free to use. No account needed.</p>
        <a href="https://buildquote.com.au/" className="inline-flex items-center gap-2 bg-orange-500 text-white text-base font-bold px-8 py-4 rounded-xl shadow-lg shadow-orange-500/30 hover:opacity-90 transition-opacity">
          Start your Request for Quotation &nbsp;&rarr;
        </a>
        <div className="text-xs text-slate-500 mt-5 font-mono tracking-wide">
          buildquote.com.au &nbsp;&middot;&nbsp; Request for Quotation, Made Simple
        </div>
      </div>

    </div>
  );
}
