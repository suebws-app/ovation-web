'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@ovation/ui/utils/cn'
import { ArrowRight } from '@ovation/icons/ArrowRight'

type FAQItemProps = {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => (
  <div className="border-b border-border py-5.5">
    <div
      className="flex cursor-pointer items-start justify-between gap-5"
      onClick={onToggle}
    >
      <span className="font-serif text-[22px] font-semibold leading-snug">
        {question}
      </span>
      <button
        type="button"
        aria-expanded={isOpen}
        className={cn(
          'flex size-7 flex-shrink-0 items-center justify-center rounded-full border border-border text-base font-semibold transition-transform',
          isOpen
            ? 'rotate-45 border-primary bg-primary text-primary-foreground'
            : 'bg-background text-foreground',
        )}
      >
        +
      </button>
    </div>
    {isOpen && (
      <p className="mt-3.5 max-w-[640px] text-[15px] leading-relaxed text-muted-foreground">
        {answer}
      </p>
    )}
  </div>
)

export const FAQSection = () => {
  const t = useTranslations()
  const [openIndex, setOpenIndex] = useState(0)

  const items = [1, 2, 3, 4, 5, 6].map((n) => ({
    q: t((`marketing__faq__q${n}`) as any),
    a: t((`marketing__faq__a${n}`) as any),
  }))

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="py-[120px]">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-20">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[2.2px] text-primary">
              {t('marketing__faq__eyebrow')}
            </p>
            <h2 className="mt-4 font-serif text-[60px] font-semibold leading-tight">
              <span className="block">{t('marketing__faq__title_line1')}</span>
              <span className="block italic text-primary">{t('marketing__faq__title_line2')}</span>
            </h2>
            <p className="mt-6 max-w-[360px] text-[17px] leading-relaxed text-muted-foreground">
              {t('marketing__faq__subtitle')}
            </p>
            <a
              href={`mailto:${t('marketing__faq__email')}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              {t('marketing__faq__email')}
              <ArrowRight className="size-3" />
            </a>
          </div>

          <div>
            {items.map((item, index) => (
              <FAQItem
                key={index}
                question={item.q}
                answer={item.a}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
