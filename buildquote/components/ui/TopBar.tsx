'use client'

interface TopBarProps {
  currentStep: 1 | 2 | 3 | 4
}

const steps = [
  { n: 1, label: 'Upload' },
  { n: 2, label: 'Review' },
  { n: 3, label: 'Send' },
  { n: 4, label: 'Done' },
]

export default function TopBar({ currentStep }: TopBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-ui-darker border-b border-border px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <a href="/" className="flex flex-col">
          <span className="font-bold text-lg tracking-tight leading-tight"><span className="text-heading">Build</span><span className="text-brand">Quote</span></span>
          <span className="text-text-secondary text-xs leading-tight font-medium">Request for Quotation, Made Simple</span>
        </a>
        <div className="flex gap-2">
          {steps.map(({ n, label }) => (
            <div
              key={n}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                n === currentStep
                  ? 'bg-brand text-white'
                  : n < currentStep
                  ? 'bg-ui text-text-secondary'
                  : 'bg-surface text-text-faint'
              }`}
            >
              <span>{n}</span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
