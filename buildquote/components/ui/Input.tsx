interface InputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  className?: string
}

export default function Input({ label, value, onChange, placeholder, type = 'text', className = '' }: InputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs text-text-muted font-medium uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-ui border border-border-subtle rounded-lg px-3 py-2 text-text-primary placeholder-text-disabled focus:outline-none focus:border-brand transition-colors"
      />
    </div>
  )
}
