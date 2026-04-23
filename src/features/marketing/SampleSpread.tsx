'use client'

import { useTranslations } from 'next-intl'
import { Play } from '@ovation/icons/Play'
import { Eyebrow } from '@ovation/ui/components/Eyebrow'

export const SampleSpread = () => {
  const t = useTranslations()

  return (
    <section className="py-[120px]">
      <div className="container max-w-[1240px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <Eyebrow className="text-primary">
              {t('marketing__sample__eyebrow')}
            </Eyebrow>

            <h2 className="font-serif text-[60px] font-semibold leading-tight tracking-tight mt-4">
              {t('marketing__sample__title_start')}{' '}
              <span className="italic">{t('marketing__sample__title_end')}</span>
            </h2>

            <p className="text-[17px] leading-relaxed text-muted-foreground mt-5 max-w-[500px]">
              {t('marketing__sample__description')}
            </p>

            <div className="grid grid-cols-3 gap-5 mt-8">
              <div>
                <p className="font-serif text-[40px] font-semibold text-primary tracking-tight">
                  {t('marketing__sample__stat1_value')}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                  {t('marketing__sample__stat1_label')}
                </p>
              </div>
              <div>
                <p className="font-serif text-[40px] font-semibold text-primary tracking-tight">
                  {t('marketing__sample__stat2_value')}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                  {t('marketing__sample__stat2_label')}
                </p>
              </div>
              <div>
                <p className="font-serif text-[40px] font-semibold text-primary tracking-tight">
                  {t('marketing__sample__stat3_value')}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                  {t('marketing__sample__stat3_label')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl p-10 border border-border shadow-xl relative">
            <span className="absolute -top-3.5 right-8 bg-destructive text-primary-foreground px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-md">
              {t('marketing__sample__saved_tag')}
            </span>

            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4">
              {t('marketing__sample__entry_label')}
            </p>

            <blockquote className="font-serif text-[28px] leading-snug italic font-medium">
              {t('marketing__sample__quote')}
            </blockquote>

            <div className="border-t border-dashed border-border my-6" />

            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center flex-shrink-0">
                <span className="font-serif text-sm font-semibold text-primary-foreground">
                  AC
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {t('marketing__sample__author_name')}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('marketing__sample__author_role')}
                </p>
              </div>

              <button
                type="button"
                className="size-[42px] rounded-full bg-primary flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <Play width={16} height={16} className="text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
