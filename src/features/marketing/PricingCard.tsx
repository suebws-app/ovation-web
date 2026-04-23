import { useTranslations } from 'next-intl'
import { cn } from '@ovation/ui/utils/cn'
import { Check } from '@ovation/icons/Check'
import { Button } from '@ovation/ui/components/Button'

type PricingFeatureProps = {
  feat: string
  highlighted: boolean
}

const PricingFeature = ({ feat, highlighted }: PricingFeatureProps) => (
  <li className="flex gap-2.5 items-start text-sm">
    <span
      className={cn(
        highlighted ? 'text-destructive' : 'text-primary',
      )}
    >
      <Check className="size-4 shrink-0 mt-0.5" strokeWidth={2.2} />
    </span>
    {feat}
  </li>
)

type PricingCardProps = {
  tierKey: 'essential' | 'keepsake' | 'gold'
  highlighted: boolean
  tagKey: string
  nameKey: string
  priceKey: string
  perKey: string
  descKey: string
  ctaKey: string
  featKeys: string[]
  price: string
}

export const PricingCard = ({
  highlighted,
  tagKey,
  nameKey,
  priceKey,
  perKey,
  descKey,
  ctaKey,
  featKeys,
  price,
}: PricingCardProps) => {
  const t = useTranslations()

  return (
    <div
      className={cn(
        'flex flex-col rounded-3xl p-8 relative border min-h-[586px]',
        highlighted
          ? 'border-2 border-primary scale-[1.02] shadow-2xl'
          : 'bg-card border-border shadow-sm',
      )}
    >
      {highlighted && (
        <>
          <div className="absolute -top-3.5 left-8 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider shadow-md">
            MOST CHOSEN
          </div>
          <div className="absolute top-0 right-0 size-[220px] rounded-full bg-destructive/20 blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
        </>
      )}

      <span
        className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground"
      >
        {t(tagKey)}
      </span>

      <p className="font-serif text-[30px] font-semibold mt-1.5">
        {t(nameKey)}
      </p>

      <div className="flex items-end gap-1.5 mt-3">
        <span className="font-serif text-[56px] font-semibold tracking-tight leading-none">
          {t(priceKey, { price })}
        </span>
        <span className="text-sm text-muted-foreground mb-2.5">
          {t(perKey)}
        </span>
      </div>

      <p className="text-sm text-muted-foreground min-h-12 mt-2">
        {t(descKey)}
      </p>

      <div className="h-px bg-border my-6" />

      <ul className="flex flex-col gap-3 flex-1">
        {featKeys.map((featKey) => (
          <PricingFeature key={featKey} feat={t(featKey)} highlighted={highlighted} />
        ))}
      </ul>

<Button size='lg' variant={highlighted?'default': 'outline'} className=' rounded-full w-full self-end'>
        {t(ctaKey)}
      </Button>
    </div>
  )
}
