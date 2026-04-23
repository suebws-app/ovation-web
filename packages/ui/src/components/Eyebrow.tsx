import { cn } from '../utils/cn'

type EyebrowProps = {
  children: React.ReactNode
  className?: string
}

export const Eyebrow = ({ children, className }: EyebrowProps) => (
  <p className={cn('text-[11px] uppercase tracking-[2.2px] font-bold', className)}>
    {children}
  </p>
)
