'use client'

import { cn } from '@ovation/ui/utils/cn'
import { Plus } from '@ovation/icons/Plus'
import { Check } from '@ovation/icons/Check'

type CoverOptionProps = {
  label: string
  tint: string
  selected?: boolean
  isUpload?: boolean
  initials?: string
  onClick?: () => void
}

export const CoverOption = ({
  label,
  tint,
  selected = false,
  isUpload = false,
  initials,
  onClick,
}: CoverOptionProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'relative aspect-square cursor-pointer overflow-hidden rounded-16',
      selected
        ? 'border-[3px] border-primary shadow-lg shadow-primary/25 ring-4 ring-primary/10'
        : 'border border-border shadow-sm'
    )}
  >
    <div
      className="flex size-full items-center justify-center"
      style={
        isUpload
          ? undefined
          : {
              background: `repeating-linear-gradient(135deg, ${tint} 0 8px, color-mix(in oklch, ${tint}, #000 10%) 8px 16px)`,
            }
      }
    >
      {isUpload ? (
        <Plus width={28} height={28} className="text-primary" strokeWidth={1.8} />
      ) : (
        <span className="font-serif text-[1.375rem] italic text-black/40">{initials}</span>
      )}
    </div>
    {selected && <SelectedBadge />}
    <span className="absolute bottom-2 left-2 right-2 type-caption font-semibold text-white drop-shadow-sm">
      {label}
    </span>
  </button>
)

const SelectedBadge = () => (
  <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary shadow-md">
    <Check width={13} height={13} className="text-primary-foreground" strokeWidth={3} />
  </div>
)
