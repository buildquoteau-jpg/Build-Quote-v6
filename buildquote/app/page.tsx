export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4">

      {/* Logo / Wordmark */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Build<span className="text-orange-500">Quote</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">
          buildquote.com.au
        </p>
      </div>

      {/* Tagline */}
      <div className="text-center mb-10 max-w-sm">
        <p className="text-2xl font-semibold text-white leading-snug">
          Request for Quotation,<br />
          <span className="text-orange-500">Made Simple.</span>
        </p>
        <p className="text-gray-400 mt-3 text-sm leading-relaxed">
          Upload your Bill of Materials — photo, PDF, spreadsheet, or handwritten note — and we&apos;ll turn it into a professional RFQ sent directly to your suppliers.
        </p>
      </div>

      {/* CTA */}
      
        href="/rfq"
        className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors w-full max-w-xs text-center"
      >
        Start your RFQ &#8594;
      </a>

      {/* Supporting info */}
      <div className="mt-10 flex flex-col gap-2 text-center text-xs text-gray-500">
        <span>&#128196; Accepts photos, PDFs, spreadsheets &amp; handwritten notes</span>
        <span>&#129302; AI-powered parsing &#8212; no manual data entry</span>
        <span>&#128231; Sends directly to your suppliers via email</span>
      </div>

    </main>
  )
}
