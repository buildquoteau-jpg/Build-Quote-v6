// Products page — embeds the NewTech Wood widget
// Update NTW_WIDGET_TOKEN with the token from your mfp.buildquote.com.au admin panel

const NTW_WIDGET_TOKEN = 'YOUR_NTW_TOKEN_HERE'

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-page">
      {/* Page header */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-6">
        <p className="text-xs font-bold tracking-widest uppercase text-text-muted mb-3">
          BUILD<span className="text-brand">QUOTE</span>
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
          Products
        </h1>
        <p className="text-text-secondary mt-2 text-base">
          Browse NewTech Wood composite timber profiles available through our supplier network.
        </p>
      </div>

      {/* Widget embed */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <iframe
          src={`https://mfp.buildquote.com.au/widget/${NTW_WIDGET_TOKEN}`}
          width="100%"
          height="900"
          style={{ border: 'none', borderRadius: '16px', display: 'block' }}
          title="NewTech Wood Products"
        />
      </div>
    </main>
  )
}
