interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`bg-surface rounded-xl p-4 overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  )
}
