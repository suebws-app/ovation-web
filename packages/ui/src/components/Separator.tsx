import { cn } from '../utils/cn'

type SeparatorProps = {
  label?: string
  className?: string
}

export const Separator = ({ label, className }: SeparatorProps) => (
  <div className={cn('flex items-center gap-3', className)}>
    <div className="h-px flex-1 bg-border" />
    {label && <span className="type-overline text-muted-foreground">{label}</span>}
    <div className="h-px flex-1 bg-border" />
  </div>
)
