'use client'

import { cn } from '@ovation/ui/utils/cn'

type SocialAuthButtonProps = {
  provider: string
  label?: string
  icon: React.ReactNode
  onClick?: () => void
  className?: string
}

export const SocialAuthButton = ({
  provider,
  label = 'Sign up with',
  icon,
  onClick,
  className,
}: SocialAuthButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'flex flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-16 border border-border bg-card px-4 py-3.5 type-body-small font-semibold text-foreground transition-colors hover:bg-muted',
      className
    )}
  >
    {icon}
    {label} {provider}
  </button>
)
