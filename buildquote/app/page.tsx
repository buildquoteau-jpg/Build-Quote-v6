export default function Home() {
  return (
    <main className="min-h-screen bg-page flex flex-col items-center justify-center px-6 shadow-[0_10px_30px_rgba(24,93,122,0.15)]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-heading">
          Build<span className="text-brand">Quote</span>
        </h1>
        <p className="text-xs text-text-muted mt-1 uppercase tracking-widest">
          buildquote.com.au
        </p>
      </div>
      <div className="text-center mb-8 w-full max-w-2xl px-2">
        <p className="text-2xl font-extrabold tracking-tight text-text-primary leading-tight">
          Your handwritten notes.<br />
          Turned into a professional RFQ.<br />
          <span className="text-brand">Instantly.</span>
        </p>
        <div className="mt-5 mx-auto w-full max-w-lg flex items-center justify-center gap-1.5 whitespace-nowrap px-2">
          <span className="text-heading text-sm font-semibold leading-none whitespace-nowrap">Snap a photo</span>
          <span className="text-brand text-sm font-bold leading-none whitespace-nowrap">-&gt;</span>
          <span className="text-heading text-sm font-semibold leading-none whitespace-nowrap">We read it</span>
          <span className="text-brand text-sm font-bold leading-none whitespace-nowrap">-&gt;</span>
          <span className="text-heading text-sm font-semibold leading-none whitespace-nowrap">You review it</span>
          <span className="text-brand text-sm font-bold leading-none whitespace-nowrap">-&gt;</span>
          <span className="text-heading text-sm font-semibold leading-none whitespace-nowrap">Hit send</span>
        </div>
      </div>
      
      <a
        href="/rfq"
        className="bg-brand hover:bg-brand-hover active:bg-brand-hover text-white font-bold text-lg px-8 py-4 rounded-2xl transition-colors w-full max-w-xs text-center shadow-[0_10px_24px_rgba(24,93,122,0.22)]"
      >
        Start your
Request for Quotation
      </a>
      <p className="text-text-secondary text-sm mt-2 font-medium">Takes about 60 seconds</p>
      <div className="mt-6 text-center max-w-xs">
        <p className="text-text-primary text-xl font-extrabold tracking-tight">Built for busy builders.</p>
        <p className="text-text-secondary text-base mt-2 leading-relaxed font-medium">Send clear building materials quote requests to your trusted suppliers in seconds.</p>
      </div>
      <div className="mt-8 flex gap-4 justify-center">
        <a href="/privacy" className="text-text-muted text-sm font-medium hover:text-text-secondary">Privacy Policy</a>
        <a href="/terms" className="text-text-muted text-sm font-medium hover:text-text-secondary">Terms of Use</a>
      </div>
    </main>
  )
}
