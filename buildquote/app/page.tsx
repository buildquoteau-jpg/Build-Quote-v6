export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-6">

      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Build<span className="text-orange-500">Quote</span>
        </h1>
        <p className="text-xs text-gray-600 mt-1 uppercase tracking-widest">
          buildquote.com.au
        </p>
      </div>

      {/* Hero */}
      <div className="text-center mb-8 max-w-sm">
        <p className="text-2xl font-bold text-white leading-tight">
          Your handwritten notes.<br />
          Turned into a professional RFQ.<br />
          <span className="text-orange-500">Instantly.</span>
        </p>

        {/* Step flow */}
        <div className="mt-5 flex items-center justify-center gap-1 flex-wrap">
          {['Snap a photo', 'We read it', 'You review it', 'Hit send'].map((step, i, arr) => (
            <span key={step} className="flex items-center gap-1">
              <span className="text-gray-300 text-sm font-medium">{step}</span>
              {i < arr.length - 1 && <span className="text-orange-500 text-sm font-bold">→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      
        href="/rfq"
        className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-colors w-full max-w-xs text-center shadow-lg shadow-orange-500/20"
      >
        Start your RFQ
      </a>
      <p className="text-gray-600 text-xs mt-2">Takes about 60 seconds</p>

    </main>
  )
}
