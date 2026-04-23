'use client'

import { Apple } from '@ovation/icons/Apple'
import { cn } from '@ovation/ui/utils/cn'
import { SocialAuthButton } from './SocialAuthButton'

type SocialAuthButtonsProps = {
  action?: 'sign-up' | 'sign-in'
  className?: string
}

export const SocialAuthButtons = ({ action = 'sign-up', className }: SocialAuthButtonsProps) => {
  const label = action === 'sign-in' ? 'Continue with' : 'Sign up with'

  return (
    <div className={cn('flex gap-2.5', className)}>
      <SocialAuthButton
        provider="Apple"
        label={label}
        icon={<AppleIconBox />}
      />
      <SocialAuthButton
        provider="Google"
        label={label}
        icon={<GoogleIconBox />}
      />
    </div>
  )
}

const AppleIconBox = () => (
  <span className="inline-flex size-[22px] items-center justify-center rounded-6 bg-foreground">
    <Apple width={12} height={12} className="text-background" />
  </span>
)

const GoogleIconBox = () => (
  <span className="inline-flex size-[22px] items-center justify-center rounded-6 border border-border bg-card type-caption font-bold text-foreground">
    G
  </span>
)
