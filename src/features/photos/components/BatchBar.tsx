'use client'

import { Button } from '@ovation/ui/components/Button'
import { Check } from '@ovation/icons/Check'

type BatchBarProps = {
  count: number
  total: number
}

export const BatchBar = ({ count, total }: BatchBarProps) => {
  if (count === 0) return null

  return (
    <div className="flex items-center gap-3 border-b border-border bg-foreground px-4 py-2.5 text-background tablet:px-4.5">
      <div className="flex size-5 items-center justify-center rounded-4 bg-secondary">
        <Check width={13} height={13} className="text-foreground" strokeWidth={2.5} />
      </div>
      <span className="type-body-small font-semibold">{count} photos selected</span>
      <span className="type-caption opacity-65">&middot; of {total}</span>
      <div className="ml-auto hidden gap-1.5 desktop:flex">
        {['Download', 'Favourite', 'Tag', 'Pair with message'].map((t) => (
          <BatchAction key={t} label={t} />
        ))}
        <Button size="sm" className="rounded-full">Use in Gold Book</Button>
      </div>
    </div>
  )
}

const BatchAction = ({ label }: { label: string }) => (
  <button
    type="button"
    className="cursor-pointer rounded-full border border-white/25 bg-transparent px-3 py-1.5 type-caption font-semibold text-background transition-colors hover:bg-white/10"
  >
    {label}
  </button>
)
