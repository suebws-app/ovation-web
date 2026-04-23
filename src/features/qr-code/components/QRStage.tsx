'use client'

import { useState } from 'react'
import { cn } from '@ovation/ui/utils/cn'
import { QRBlock } from './QRBlock'

const TABS = ['Standard', 'With photo', 'Poster']

type QRStageProps = {
  coupleName?: string
  url?: string
}

export const QRStage = ({ coupleName = 'Lena & Tomás', url = 'lena-and-tomas' }: QRStageProps) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-20 bg-gradient-to-br from-primary to-primary/80 p-7 tablet:p-12">
      <div
        className="pointer-events-none absolute -top-15 -right-15 size-55 rounded-full"
        style={{ background: 'radial-gradient(circle, oklch(0.723 0.135 40 / 0.3), transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 size-50 rounded-full"
        style={{ background: 'radial-gradient(circle, oklch(0.818 0.105 73.3 / 0.4), transparent 70%)' }}
      />

      <div className="relative text-center text-primary-foreground">
        <p className="type-overline tracking-[2px] opacity-85">Scan to leave a message</p>
        <p className="mt-1.5 font-serif text-[1.5rem] font-medium italic tablet:text-[1.875rem]">
          {coupleName}
        </p>
      </div>

      <div className="relative rounded-16 bg-card p-5 shadow-lg">
        <QRBlock size={220} />
      </div>

      <p className="relative font-mono type-body-small tracking-wider text-primary-foreground/90">
        ovation.love/{url}
      </p>

      <div className="relative flex gap-2">
        {TABS.map((tab, i) => (
          <QRTabButton
            key={tab}
            label={tab}
            active={activeTab === i}
            onClick={() => setActiveTab(i)}
          />
        ))}
      </div>
    </div>
  )
}

const QRTabButton = ({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'cursor-pointer rounded-full px-3.5 py-1.5 type-caption font-semibold transition-colors',
      active ? 'bg-card text-foreground' : 'bg-white/15 text-primary-foreground hover:bg-white/25'
    )}
  >
    {label}
  </button>
)
