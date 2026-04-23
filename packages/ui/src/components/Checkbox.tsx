'use client'

import { forwardRef } from 'react'
import { cn } from '../utils/cn'

type CheckboxProps = Omit<React.ComponentProps<'button'>, 'onChange'> & {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: React.ReactNode
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked = false, onChange, label, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={cn('flex items-start gap-2.5 text-left', className)}
      {...props}
    >
      <CheckboxIndicator checked={checked} />
      {label && (
        <span className="type-body-small leading-snug text-muted-foreground">{label}</span>
      )}
    </button>
  )
)
Checkbox.displayName = 'Checkbox'

const CheckboxIndicator = ({ checked }: { checked: boolean }) => (
  <span
    className={cn(
      'mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-6 transition-colors',
      checked ? 'bg-primary text-primary-foreground' : 'border-[1.5px] border-border bg-card'
    )}
  >
    {checked && (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    )}
  </span>
)
