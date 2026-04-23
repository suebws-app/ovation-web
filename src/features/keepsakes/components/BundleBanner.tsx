'use client'

import { Button } from '@ovation/ui/components/Button'
import { ArrowRight } from '@ovation/icons/ArrowRight'

export const BundleBanner = () => (
  <div className="flex flex-col gap-4 rounded-20 border border-dashed border-accent bg-gradient-to-br from-accent/15 to-destructive/10 p-5 tablet:flex-row tablet:items-center tablet:gap-4.5">
    <div className="flex size-11 shrink-0 items-center justify-center rounded-12 bg-accent">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13M20 12v9H4v-9M7.5 8a2.5 2.5 0 1 1 0-5c2 0 3 1.5 4.5 5C13.5 4.5 14.5 3 16.5 3a2.5 2.5 0 1 1 0 5" />
      </svg>
    </div>
    <div className="flex-1">
      <p className="type-overline tracking-[1.5px]" style={{ color: '#9A6B2F' }}>
        Keepsake bundle &middot; save &euro;47
      </p>
      <p className="mt-1 font-serif type-h4 font-semibold leading-snug">
        Gold Book + Thank-You Cards + Digital Album for{' '}
        <span className="italic" style={{ color: '#C88C36' }}>&euro;149</span>
      </p>
    </div>
    <Button size="lg" className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 tablet:w-auto">
      Add bundle <ArrowRight width={13} height={13} />
    </Button>
  </div>
)
