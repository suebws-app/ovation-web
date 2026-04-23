'use client'

import { useTranslations } from 'next-intl'
import { ArrowRight } from '@ovation/icons/ArrowRight'
import { Check } from '@ovation/icons/Check'
import { Eyebrow } from '@ovation/ui/components/Eyebrow'

export const FinalCTA = () => {
  const t = useTranslations()

  return (
    <section className="pb-[100px]">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-20">
        <div className="bg-gradient-to-br from-warm-cream to-warm-panel rounded-[32px] p-12 lg:p-[72px_80px] border border-warm-panel shadow-2xl relative overflow-hidden">
          <div className="absolute pointer-events-none top-[-120px] right-[-80px] size-[360px] rounded-full bg-destructive/30 blur-3xl" />
          <div className="absolute pointer-events-none bottom-[-120px] left-[-40px] size-[320px] rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute pointer-events-none top-10 left-[45%] size-[180px] rounded-full bg-secondary/20 blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
            <div className="relative">
              <Eyebrow className="text-destructive">
                {t('marketing__cta__eyebrow')}
              </Eyebrow>
              <h2 className="font-serif text-5xl lg:text-[64px] font-semibold leading-none tracking-tight mt-3.5 text-foreground">
                {t('marketing__cta__title_line1')}
                <br />
                <span className="italic text-primary">{t('marketing__cta__title_line2')}</span>
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground mt-5 max-w-[460px]">
                {t('marketing__cta__description')}
              </p>
            </div>

            <div className="relative">
              <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">
                {t('marketing__cta__quick_start')}
              </p>

              <div className="mt-3 bg-card/75 backdrop-blur border border-border rounded-2xl p-4 flex items-center gap-2.5">
                <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-card border border-border">
                  {t('marketing__cta__domain_prefix')}
                </span>
                <span className="font-serif italic text-base text-foreground flex-1">
                  {t('marketing__cta__domain_placeholder')}
                </span>
                <span className="size-5.5 rounded-full bg-secondary flex items-center justify-center">
                  <Check width={12} height={12} stroke="white" strokeWidth={1.5} />
                </span>
              </div>

              <button className="mt-3.5 w-full py-4.5 rounded-full bg-destructive text-white font-semibold text-base flex items-center justify-center gap-2 shadow-xl">
                {t('marketing__cta__button')}
                <ArrowRight />
              </button>

              <p className="mt-3.5 text-xs text-muted-foreground text-center">
                {t('marketing__cta__disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
