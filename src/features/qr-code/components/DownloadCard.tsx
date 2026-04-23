'use client'

import { cn } from '@ovation/ui/utils/cn'
import { Eyebrow } from '@ovation/ui/components/Eyebrow'

const FORMATS = [
  { ext: 'PNG', desc: '2048 \u00d7 2048', size: '142 KB' },
  { ext: 'SVG', desc: 'Vector', size: '8 KB' },
  { ext: 'PDF', desc: 'Print-ready \u00b7 A4 card sheet', size: '38 KB' },
  { ext: 'EPS', desc: 'Vector for Illustrator', size: '14 KB' },
]

export const DownloadCard = () => (
  <div className="rounded-16 border border-border bg-card p-4.5">
    <Eyebrow className="mb-3 text-muted-foreground">Download</Eyebrow>
    <div className="flex flex-col gap-2">
      {FORMATS.map((f, i) => (
        <FormatRow key={f.ext} {...f} primary={i === 0} />
      ))}
    </div>
  </div>
)

const FormatRow = ({
  ext,
  desc,
  size,
  primary,
}: {
  ext: string
  desc: string
  size: string
  primary: boolean
}) => (
  <div className="flex items-center gap-3 rounded-12 border border-border bg-background p-3">
    <div
      className={cn(
        'flex size-10 items-center justify-center rounded-8 type-caption font-bold tracking-wider',
        primary ? 'bg-primary/10 text-primary' : 'border border-border bg-card text-muted-foreground'
      )}
    >
      {ext}
    </div>
    <div className="min-w-0 flex-1">
      <p className="type-body-small font-semibold">{ext}</p>
      <p className="type-caption text-muted-foreground">{desc} &middot; {size}</p>
    </div>
    <button
      type="button"
      className={cn(
        'flex size-[34px] cursor-pointer items-center justify-center rounded-full transition-colors',
        primary
          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/35'
          : 'border border-border bg-card text-foreground hover:bg-muted'
      )}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v13m0 0l-5-5m5 5l5-5" />
        <path d="M5 21h14" />
      </svg>
    </button>
  </div>
)
