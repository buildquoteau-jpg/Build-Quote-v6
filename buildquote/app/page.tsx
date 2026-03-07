export default function Home() {
  return (
    <main className="min-h-screen bg-page flex flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Build<span className="text-brand">Quote</span>
        </h1>
        <p className="text-xs text-text-muted mt-1 uppercase tracking-widest">
          buildquote.com.au
        </p>
      </div>
      <div className="text-center mb-8 max-w-sm">
        <p className="text-2xl font-bold text-text-primary leading-tight">
          Your handwritten notes.<br />
          Turned into a professional RFQ.<br />
          <span className="text-brand">Instantly.</span>
        </p>
        <div className="mt-5 flex items-center justify-center gap-1 flex-wrap">
          <span className="text-text-secondary text-sm font-medium">Snap a photo</span>
          <span className="text-brand text-sm font-bold mx-1">-&gt;</span>
          <span className="text-text-secondary text-sm font-medium">We read it</span>
          <span className="text-brand text-sm font-bold mx-1">-&gt;</span>
          <span className="text-text-secondary text-sm font-medium">You review it</span>
          <span className="text-brand text-sm font-bold mx-1">-&gt;</span>
          <span className="text-text-secondary text-sm font-medium">Hit send</span>
        </div>
      </div>
      
      <a
        href="/rfq"
        className="bg-brand hover:bg-brand-hover active:bg-brand-hover text-text-primary font-bold text-lg px-8 py-4 rounded-2xl transition-colors w-full max-w-xs text-center shadow-lg"
      >
        Start your RFQ
      </a>
      <p className="text-text-secondary text-xs mt-2">Takes about 60 seconds</p>
      <div className="mt-6 text-center max-w-xs">
        <p className="text-text-primary text-base font-semibold">Built for busy builders.</p>
        <p className="text-text-secondary text-sm mt-1 leading-relaxed">Send clear building materials quote requests to your trusted suppliers in seconds.</p>
      </div>
      <div className="mt-8 flex gap-4 justify-center">
        <a href="/privacy" className="text-text-faint text-xs hover:text-text-muted">Privacy Policy</a>
        <a href="/terms" className="text-text-faint text-xs hover:text-text-muted">Terms of Use</a>
      </div>
    </main>
  )
}
