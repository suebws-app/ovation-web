'use client'

import { Logo } from '@ovation/ui/components/Logo'
import { Stepper } from '@ovation/ui/components/Stepper'
import { useSignUpStore } from '@/features/auth/SignUp/useSignUpStore'

export const SignUpHeader = () => {
  const step = useSignUpStore((s) => s.step)
  const totalSteps = useSignUpStore((s) => s.totalSteps)

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-7 tablet:px-14">
      <Logo />
      <Stepper currentStep={step} totalSteps={totalSteps} />
      <button
        type="button"
        className="cursor-pointer type-body-small text-muted-foreground transition-colors hover:text-foreground"
      >
        Save &amp; finish later
      </button>
    </header>
  )
}
