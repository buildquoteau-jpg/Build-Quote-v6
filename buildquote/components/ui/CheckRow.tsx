interface CheckRowProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}
export default function CheckRow({ label, checked, onChange }: CheckRowProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer py-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 accent-brand"
      />
      <span className="text-text-secondary text-sm">{label}</span>
    </label>
  )
}
