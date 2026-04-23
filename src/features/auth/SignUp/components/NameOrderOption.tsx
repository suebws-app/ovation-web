'use client'

import { cn } from '@ovation/ui/utils/cn'

type NameOrderOptionProps = {
  label: string
  active?: boolean
  onClick?: () => void
}

export const NameOrderOption = ({ label, active = false, onClick }: NameOrderOptionProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'cursor-pointer rounded-full px-3.5 py-2.5 type-body-small font-semibold transition-colors',
      active
        ? 'bg-primary text-primary-foreground'
        : 'border border-border bg-card text-foreground hover:bg-muted'
    )}
  >
    {label}
  </button>
)
