'use client'

import { cn } from '@ovation/ui/utils/cn'
import { Button } from '@ovation/ui/components/Button'
import { Check } from '@ovation/icons/Check'

type PlanCardProps = {
  name: string
  price: string
  per: string
  description: string
  features: string[]
  highlighted?: boolean
  onSelect?: () => void
}

export const PlanCard = ({
  name,
  price,
  per,
  description,
  features,
  highlighted = false,
  onSelect,
}: PlanCardProps) => (
  <div
    className={cn(
      'relative rounded-20 p-7',
      highlighted
        ? 'scale-[1.02] border-2 border-primary bg-card shadow-lg shadow-primary/20'
        : 'border border-border bg-background'
    )}
  >
    {highlighted && <MostChosenBadge />}
    <p className="font-serif text-[1.625rem] font-semibold">{name}</p>
    <div className="mt-2.5 flex items-baseline gap-1.5">
      <span className="font-serif text-[2.75rem] font-semibold tracking-tight">{price}</span>
      <span className="type-caption text-muted-foreground">{per}</span>
    </div>
    <p className="mt-2.5 min-h-[42px] type-body-small leading-relaxed text-muted-foreground">
      {description}
    </p>
    <div className="my-4.5 h-px bg-border" />
    <div className="flex flex-col gap-2.5">
      {features.map((feature) => (
        <PlanFeature key={feature} label={feature} />
      ))}
    </div>
    <Button
      onClick={onSelect}
      variant={highlighted ? 'default' : 'outline'}
      className={cn('mt-6 w-full rounded-full', highlighted && 'shadow-md shadow-primary/40')}
    >
      {highlighted ? `Choose ${name}` : `Choose ${name}`}
    </Button>
  </div>
)

const MostChosenBadge = () => (
  <div className="absolute -top-3 left-6 rounded-full bg-destructive px-3 py-1.5 type-caption font-bold tracking-wider text-primary-foreground shadow-md shadow-destructive/40">
    MOST CHOSEN
  </div>
)

const PlanFeature = ({ label }: { label: string }) => (
  <div className="flex items-start gap-2 type-body-small">
    <Check
      width={14}
      height={14}
      className="mt-0.5 shrink-0 text-primary"
      strokeWidth={2.2}
    />
    {label}
  </div>
)
