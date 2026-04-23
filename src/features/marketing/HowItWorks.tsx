'use client'

import { useTranslations } from 'next-intl'
import { Mic } from '@ovation/icons/Mic'
import { Play } from '@ovation/icons/Play'
import { Eyebrow } from '@ovation/ui/components/Eyebrow'

const WAVEFORM_HEIGHTS = [8, 14, 20, 28, 36, 44, 36, 28, 44, 36, 20, 28, 36, 44, 36, 28, 20, 14, 28, 36, 20, 12]
const MINI_WAVEFORM_HEIGHTS = [4, 8, 12, 8, 16, 10, 6, 14, 8, 12, 6, 10]

type QrCellProps = { index: number }

const QrCell = ({ index }: QrCellProps) => (
  <div
    className="aspect-square rounded-[1px]"
    style={{ backgroundColor: (index + Math.floor(index / 5)) % 2 === 0 ? 'var(--foreground)' : 'transparent' }}
  />
)

type WaveformBarProps = { height: number; variant: 'primary' | 'mini' }

const WaveformBar = ({ height, variant }: WaveformBarProps) => (
  <div
    className={variant === 'primary' ? 'w-[3px] rounded-full bg-destructive opacity-70' : 'w-[2px] rounded-full bg-secondary opacity-80'}
    style={{ height: `${height}px` }}
  />
)

type QrCardProps = { rotation: number; translateX: number }

const QrCard = ({ rotation, translateX }: QrCardProps) => (
  <div
    className="absolute w-[110px] h-[150px] bg-card border border-border rounded-lg flex flex-col items-center justify-center gap-1.5 p-3"
    style={{ transform: `rotate(${rotation}deg) translateX(${translateX}px)` }}
  >
    <div className="w-full grid grid-cols-5 gap-0.5">
      {Array.from({ length: 25 }).map((_, j) => (
        <QrCell key={j} index={j} />
      ))}
    </div>
  </div>
)

const QR_CARDS: Array<{ rotation: number; translateX: number }> = [
  { rotation: -6, translateX: -18 },
  { rotation: 0, translateX: 0 },
  { rotation: 6, translateX: 18 },
]

const Step1Illustration = () => (
  <div className="relative h-40 flex items-center justify-center">
    <div className="relative w-[150px] h-[150px] flex items-center justify-center">
      {QR_CARDS.map((card) => (
        <QrCard key={card.rotation} rotation={card.rotation} translateX={card.translateX} />
      ))}
    </div>
  </div>
)

const Step2Illustration = () => (
  <div className="flex flex-col items-center gap-4 h-40 justify-center">
    <div className="relative size-20 rounded-full flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, var(--destructive), oklch(from var(--destructive) calc(l - 0.1) c h))' }}>
      <div className="absolute inset-0 rounded-full"
        style={{ boxShadow: '0 0 0 8px color-mix(in oklch, var(--destructive) 20%, transparent), 0 0 0 16px color-mix(in oklch, var(--destructive) 10%, transparent)' }} />
      <Mic className="text-primary-foreground" width={32} height={32} />
    </div>
    <div className="flex items-end gap-[2px] h-8">
      {WAVEFORM_HEIGHTS.map((h, i) => (
        <WaveformBar key={i} height={h} variant="primary" />
      ))}
    </div>
  </div>
)

const Step3Illustration = ({ quoteText, timeLabel }: { quoteText: string; timeLabel: string }) => (
  <div className="h-40 flex items-center justify-center">
    <div className="w-[220px] h-[150px] rounded-xl border border-border bg-card shadow-lg flex flex-col justify-between p-4">
      <span className="text-[10px] text-muted-foreground font-medium">{timeLabel}</span>
      <p className="font-serif text-[13px] italic text-foreground leading-snug line-clamp-3">{quoteText}</p>
      <div className="flex items-center gap-2">
        <div className="size-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <Play className="text-secondary-foreground" width={10} height={10} />
        </div>
        <div className="flex items-end gap-[2px] h-4">
          {MINI_WAVEFORM_HEIGHTS.map((h, i) => (
            <WaveformBar key={i} height={h} variant="mini" />
          ))}
        </div>
      </div>
    </div>
  </div>
)

const STEP_COLORS: Record<number, string> = {
  1: 'text-primary',
  2: 'text-destructive',
  3: 'text-secondary',
}

export const HowItWorks = () => {
  const t = useTranslations()

  const steps = [
    {
      number: '01',
      tag: t('marketing__how__step1_tag'),
      title: t('marketing__how__step1_title'),
      body: t('marketing__how__step1_body'),
      illustration: <Step1Illustration />,
    },
    {
      number: '02',
      tag: t('marketing__how__step2_tag'),
      title: t('marketing__how__step2_title'),
      body: t('marketing__how__step2_body'),
      illustration: <Step2Illustration />,
    },
    {
      number: '03',
      tag: t('marketing__how__step3_tag'),
      title: t('marketing__how__step3_title'),
      body: t('marketing__how__step3_body'),
      illustration: (
        <Step3Illustration
          quoteText={t('marketing__how__step3_quote')}
          timeLabel={t('marketing__how__step3_time_label')}
        />
      ),
    },
  ]

  return (
    <section className="py-[120px] bg-card border-t border-b border-border">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-20">
        <div className="flex justify-between items-end mb-14">
          <div className="max-w-[640px]">
            <Eyebrow className="text-primary mb-3">
              {t('marketing__how__eyebrow')}
            </Eyebrow>
            <h2 className="font-serif text-[60px] font-semibold leading-tight tracking-tight">
              {t('marketing__how__title_line1')}
              <br />
              <em className="text-primary">{t('marketing__how__title_line2')}</em>
            </h2>
          </div>
          <div className="max-w-[360px]">
            <p className="text-muted-foreground">{t('marketing__how__subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const colorClass = STEP_COLORS[stepNumber]
            return (
              <div
                key={step.number}
                className="bg-background rounded-3xl p-8 border border-border min-h-[440px] flex flex-col gap-5 overflow-hidden relative"
              >
                <div className="flex items-center justify-between">
                  <span className={`font-serif text-[44px] italic font-semibold leading-none ${colorClass}`}>
                    {step.number}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground px-2.5 py-1.5 rounded-full bg-card border border-border">
                    {step.tag}
                  </span>
                </div>

                <div className="h-40 flex items-center justify-center">
                  {step.illustration}
                </div>

                <div className="mt-auto">
                  <h3 className="font-serif text-[28px] font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-3">{step.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
