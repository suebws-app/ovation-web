'use client'

import { Eyebrow } from '@ovation/ui/components/Eyebrow'
import { LinkIcon } from '@ovation/icons/LinkIcon'

type UrlCardProps = {
  url?: string
}

export const UrlCard = ({ url = 'lena-and-tomas' }: UrlCardProps) => (
  <div className="rounded-16 border border-border bg-card p-4.5">
    <Eyebrow className="mb-2.5 text-muted-foreground">Your short link</Eyebrow>
    <div className="flex items-center gap-2.5">
      <LinkIcon width={16} height={16} className="text-muted-foreground" />
      <span className="flex-1 font-mono type-body-small text-foreground">
        ovation.love/{url}
      </span>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 type-caption font-semibold text-foreground transition-colors hover:bg-muted"
      >
        Copy
      </button>
    </div>
    <div className="mt-2.5 flex items-center gap-1.5 type-caption text-muted-foreground">
      <span className="size-1.5 rounded-full bg-secondary" />
      Live since Sep 12 &middot;{' '}
      <button type="button" className="cursor-pointer font-semibold text-primary">
        Change link
      </button>
    </div>
  </div>
)
