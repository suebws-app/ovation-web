'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@ovation/ui/utils/cn'
import { Eyebrow } from '@ovation/ui/components/Eyebrow'

type StatCardProps = { value: string; label: string }

const StatCard = ({ value, label }: StatCardProps) => (
  <div className="bg-white/10 backdrop-blur border border-white/[0.18] rounded-2xl p-4.5">
    <p className="font-serif text-[34px] font-semibold leading-none">{value}</p>
    <p className="text-xs opacity-80 mt-0.5">{label}</p>
  </div>
)

export const TestimonialSection = () => {
  const t = useTranslations()

  const stats = [
    { value: t('marketing__testimonial__stat1_value'), label: t('marketing__testimonial__stat1_label') },
    { value: t('marketing__testimonial__stat2_value'), label: t('marketing__testimonial__stat2_label') },
    { value: t('marketing__testimonial__stat3_value'), label: t('marketing__testimonial__stat3_label') },
  ]

  return (
    <section className="py-[120px] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-80px] size-[400px] rounded-full bg-destructive/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-60px] size-[320px] rounded-full bg-accent/25 blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-6 lg:px-20 relative">
        <Eyebrow className="opacity-75 mb-6">
          {t('marketing__testimonial__eyebrow')}
        </Eyebrow>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16 items-center">
          <div>
            <blockquote className="font-serif text-3xl lg:text-[50px] leading-tight italic font-medium tracking-tight">
              {t('marketing__testimonial__quote')}
            </blockquote>

            <div className="flex items-center gap-4 mt-10">
              <div className="size-[52px] rounded-full bg-accent/60 flex items-center justify-center font-serif text-lg font-bold shrink-0">
                SR
              </div>
              <div>
                <p className="font-semibold text-[15px]">{t('marketing__testimonial__couple_name')}</p>
                <p className="text-sm opacity-80">{t('marketing__testimonial__couple_detail')}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {stats.map((stat, index) => (
              <StatCard key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
