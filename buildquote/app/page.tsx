export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Build<span className="text-orange-500">Quote</span>
        </h1>
        <p className="text-xs text-gray-600 mt-1 uppercase tracking-widest">
          buildquote.com.au
        </p>
      </div>
      <div className="text-center mb-8 max-w-sm">
        <p className="text-2xl font-bold text-white leading-tight">
          Your handwritten notes.<br />
          Turned into a professional RFQ.<br />
          <span className="text-orange-500">Instantly.</span>
        </p>
        <div className="mt-5 flex items-center justify-center gap-1 flex-wrap">
          <span className="text-gray-300 text-sm font-medium">Snap a photo</span>
          <span className="text-orange-500 text-sm font-bold mx-1">-&gt;</span>
          <span className="text-gray-300 text-sm font-medium">We read it</span>
          <span className="text-orange-500 text-sm font-bold mx-1">-&gt;</span>
          <span className="text-gray-300 text-sm font-medium">You review it</span>
          <span className="text-orange-500 text-sm font-bold mx-1">-&gt;</span>
          <span className="text-gray-300 text-sm font-medium">Hit send</span>
        </div>
      </div>
      <a
        href="/rfq"
        className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-colors w-full max-w-xs text-center shadow-lg shadow-orange-500/20"
      >
        Start your RFQ
      </a>
      <p className="text-gray-600 text-xs mt-2">Takes about 60 seconds</p>
      <div className="mt-6 text-center max-w-xs">
        <p className="text-white text-sm font-semibold">Built for busy builders.</p>
        <p className="text-gray-400 text-xs mt-1 leading-relaxed">Send clear building materials quote requests to your trusted suppliers in seconds.</p>
      </div>
    </main>
  )
}
