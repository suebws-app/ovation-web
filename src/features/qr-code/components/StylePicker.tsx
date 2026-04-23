'use client'

import { useState } from 'react'
import { cn } from '@ovation/ui/utils/cn'
import { Eyebrow } from '@ovation/ui/components/Eyebrow'
import { QRBlock } from './QRBlock'

const STYLES = [
  { id: 'classic', label: 'Classic', dark: '#2D2D2D', light: '#fff' },
  { id: 'blue', label: 'Cornflower', dark: '#5a7fd4', light: '#fff' },
  { id: 'peach', label: 'Peach', dark: '#EC8662', light: '#fff' },
  { id: 'sand', label: 'Sand on ink', dark: '#F9F7F4', light: '#2D2D2D' },
]

export const StylePicker = () => {
  const [selected, setSelected] = useState('classic')
  const [showLogo, setShowLogo] = useState(true)

  return (
    <div className="rounded-16 border border-border bg-card p-4.5">
      <Eyebrow className="mb-3 text-muted-foreground">Style</Eyebrow>
      <div className="grid grid-cols-4 gap-2.5">
        {STYLES.map((s) => (
          <StyleOption
            key={s.id}
            {...s}
            active={selected === s.id}
            onClick={() => setSelected(s.id)}
          />
        ))}
      </div>
      <label className="mt-3.5 flex cursor-pointer items-center gap-2 type-caption text-muted-foreground">
        <span
          className={cn(
            'relative inline-block h-5 w-[34px] rounded-full transition-colors',
            showLogo ? 'bg-primary shadow-input' : 'bg-border'
          )}
          onClick={() => setShowLogo(!showLogo)}
        >
          <span
            className={cn(
              'absolute top-0.5 size-4 rounded-full bg-card shadow-sm transition-all',
              showLogo ? 'left-[16px]' : 'left-0.5'
            )}
          />
        </span>
        Include logo in centre
      </label>
    </div>
  )
}

const StyleOption = ({
  id,
  label,
  dark,
  light,
  active,
  onClick,
}: {
  id: string
  label: string
  dark: string
  light: string
  active: boolean
  onClick: () => void
}) => (
  <button type="button" onClick={onClick} className="cursor-pointer text-center">
    <div
      className={cn(
        'rounded-10 p-2 transition-all',
        active
          ? 'border-2 border-primary shadow-input'
          : 'border border-border'
      )}
      style={{ background: light }}
    >
      <QRBlock size={56} dark={dark} light={light} withLogo={false} />
    </div>
    <p className={cn('mt-1.5 type-caption', active ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
      {label}
    </p>
  </button>
)
