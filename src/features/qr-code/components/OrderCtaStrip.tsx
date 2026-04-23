'use client'

import { Button } from '@ovation/ui/components/Button'

export const OrderCtaStrip = () => (
  <div className="flex flex-col gap-4 rounded-16 border border-destructive/30 bg-gradient-to-br from-destructive/10 to-accent/10 p-5 tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6">
    <div className="flex-1">
      <p className="type-overline tracking-[2px] text-destructive">Want it on paper?</p>
      <p className="mt-1.5 font-serif text-[1.375rem] font-semibold leading-snug tracking-tight tablet:text-[1.625rem]">
        Letterpress QR cards &mdash;{' '}
        <span className="italic text-destructive">from &euro;1.89 each.</span>
      </p>
      <p className="mt-1.5 type-body-small text-muted-foreground">
        Hand-printed in Lisbon. Ships to Girona in 5&ndash;7 days.
      </p>
    </div>
    <Button size="lg" className="w-full rounded-full shadow-md shadow-primary/40 tablet:w-auto">
      Order cards
    </Button>
  </div>
)
