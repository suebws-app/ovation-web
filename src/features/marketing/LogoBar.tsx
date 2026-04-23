'use client'

import { useTranslations } from 'next-intl'

const LOGOS = [
  'The Knot',
  'Vogue Weddings',
  'Condé Nast',
  'Bruid&Bruidegom',
  'Hola! Novias',
  'Martha Stewart',
]

const LogoName = ({ name }: { name: string }) => (
  <span className="font-serif text-[22px] font-medium text-foreground tracking-tight">
    {name}
  </span>
)

export const LogoBar = () => {
  const t = useTranslations()

  return (
    <div className="border-t border-border pt-10">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-20">
        <p className="text-center text-[11px] font-bold uppercase tracking-[2.2px] text-muted-foreground mb-6">
          {t('marketing__logos__title')}
        </p>
        <div className="flex justify-between items-center opacity-50">
          {LOGOS.map((name) => (
            <LogoName key={name} name={name} />
          ))}
        </div>
      </div>
    </div>
  )
}
