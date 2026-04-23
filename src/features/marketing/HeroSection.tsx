'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@ovation/ui/components/Button'
import { ArrowRight } from '@ovation/icons/ArrowRight'
import { Link } from '@/i18n/navigation'
import { HeroShowpiece } from './HeroShowpiece'

const avatars = [
  { initials: 'L', bg: 'bg-primary' },
  { initials: 'M', bg: 'bg-destructive' },
  { initials: 'J', bg: 'bg-accent' },
  { initials: 'A', bg: 'bg-secondary' },
]

type AvatarCircleProps = { initials: string; bg: string; overlap: boolean }

const AvatarCircle = ({ initials, bg, overlap }: AvatarCircleProps) => (
  <div
    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-background font-serif text-sm font-semibold text-primary-foreground ${bg} ${overlap ? '-ml-2.5' : ''}`}
  >
    {initials}
  </div>
)

export const HeroSection = () => {
  const t = useTranslations()

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-destructive/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-15 px-6 lg:grid-cols-[1.15fr_1fr] lg:px-20">
        <div className="flex flex-col gap-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-secondary" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">
              {t('marketing__hero__badge', { count: '2,840', countries: '34' })}
            </span>
          </div>

          <h1 className="font-serif text-7xl font-semibold leading-none tracking-tighter lg:text-[96px]">
            <span className="block text-foreground">{t('marketing__hero__title_line1')}</span>
            <span className="block italic text-primary">{t('marketing__hero__title_line2')}</span>
          </h1>

          <p className="max-w-[520px] text-[17px] leading-relaxed text-muted-foreground">
            {t('marketing__hero__description')}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                {t('marketing__hero__cta_primary')}
                <ArrowRight width={18} height={18} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/sample">
                {t('marketing__hero__cta_secondary')}
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex">
              {avatars.map((a, i) => (
                <AvatarCircle key={a.initials} initials={a.initials} bg={a.bg} overlap={i > 0} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('marketing__hero__social_proof', { rating: '4.9' })}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <HeroShowpiece />
        </div>
      </div>
    </section>
  )
}
