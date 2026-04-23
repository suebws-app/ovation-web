'use client'

import { Eyebrow } from '@ovation/ui/components/Eyebrow'

const CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
  { id: 'email', label: 'Email', color: 'oklch(0.705 0.120 262.5)' },
  { id: 'messages', label: 'Messages', color: '#2CBE4E' },
  { id: 'airdrop', label: 'AirDrop', color: '#0C84FE' },
]

type ShareCardProps = {
  url?: string
}

export const ShareCard = ({ url = 'lena-and-tomas' }: ShareCardProps) => (
  <div className="rounded-16 border border-border bg-card p-4.5">
    <Eyebrow className="mb-3 text-muted-foreground">Share directly</Eyebrow>
    <div className="grid grid-cols-4 gap-2.5">
      {CHANNELS.map((c) => (
        <ShareChannel key={c.id} {...c} />
      ))}
    </div>

    <div className="mt-3.5 rounded-10 border border-dashed border-border bg-background p-3">
      <p className="type-overline tracking-wider text-muted-foreground">Suggested message</p>
      <p className="mt-1 font-serif type-body-small italic text-foreground">
        &ldquo;Hi! Would you record a short voice message for our wedding book?
        Scan the code or tap &mdash;{' '}
        <span className="not-italic font-mono">ovation.love/{url}</span>.
        Love, L&amp;T&rdquo;
      </p>
    </div>
  </div>
)

const ShareChannel = ({ label, color }: { label: string; color: string }) => (
  <button
    type="button"
    className="flex cursor-pointer flex-col items-center gap-1.5 rounded-12 border border-border bg-background p-3 transition-colors hover:bg-muted"
  >
    <span
      className="flex size-9 items-center justify-center rounded-10 text-primary-foreground"
      style={{ background: color }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
      </svg>
    </span>
    <span className="type-caption font-semibold text-foreground">{label}</span>
  </button>
)
