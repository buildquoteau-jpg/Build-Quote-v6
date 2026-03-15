'use client'

interface TopBarProps {
  currentStep: 1 | 2 | 3 | 4 | 5
}

const steps = [
  { n: 1, label: 'Start' },
  { n: 2, label: 'Enter' },
  { n: 3, label: 'Review' },
  { n: 4, label: 'Send' },
  { n: 5, label: 'Done' },
]

export default function TopBar({ currentStep }: TopBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-ui-darker border-b border-border px-3 sm:px-4 py-2 sm:py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <a href="/" className="flex flex-col shrink-0">
          <span className="font-bold text-base sm:text-lg tracking-tight leading-tight">
            <span className="text-heading">Build</span>
            <span className="text-brand">Quote</span>
          </span>
          <span className="text-text-secondary text-[10px] sm:text-xs leading-tight font-medium hidden sm:block">
            Request for Quotation, Made Simple
          </span>
        </a>
        <div className="flex gap-1.5 sm:gap-2">
          {steps.map(({ n, label }) => (
            <div
              key={n}
              className={`flex items-center justify-center gap-1 w-7 h-7 sm:w-auto sm:h-auto sm:px-2 sm:py-1 rounded-full text-xs font-medium transition-colors ${
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
