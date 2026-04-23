import { cn } from '../utils/cn'

type LogoProps = {
  iconOnly?: boolean
  className?: string
}

export const Logo = ({ iconOnly, className }: LogoProps) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary font-serif text-base font-bold text-primary-foreground">
        O
      </div>
      {!iconOnly && (
        <span className="font-serif text-xl font-semibold text-foreground">Ovation</span>
      )}
    </div>
  )
}
