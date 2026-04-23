'use client'

import { Button } from '@ovation/ui/components/Button'
import { OtpInput } from '@ovation/ui/components/OtpInput'
import { Eyebrow } from '@ovation/ui/components/Eyebrow'
import { Logo } from '@ovation/ui/components/Logo'
import { ArrowRight } from '@ovation/icons/ArrowRight'
import { useSignInStore } from '../useSignInStore'
import { useRouter } from '@/i18n/navigation'

export const TwoFactorStep = () => {
  const { formData, updateFormData } = useSignInStore()
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(800px_500px_at_50%_0%,_oklch(0.705_0.120_262.5/0.15),_transparent_60%),radial-gradient(600px_400px_at_90%_100%,_oklch(0.723_0.135_40/0.08),_transparent_60%)]">
      <div className="w-full max-w-[520px] text-center">
        <Logo className="mx-auto mb-10 justify-center" />

        <ShieldIcon />

        <h1 className="mt-5 font-serif text-[2.5rem] font-semibold leading-tight tracking-tight">
          Confirm it&apos;s you.
        </h1>
        <p className="mx-auto mt-3.5 max-w-[420px] type-body-small leading-relaxed text-muted-foreground">
          We sent a 6-digit code to your phone.
          It expires in <strong className="text-destructive">4:52</strong>.
        </p>

        <OtpInput
          value={formData.otpCode}
          onChange={(value) => updateFormData({ otpCode: value })}
          className="mt-10"
        />

        <div className="mt-6 flex items-center justify-center gap-3.5 type-body-small text-muted-foreground">
          <button type="button" className="cursor-pointer font-semibold text-primary">
            Send again
          </button>
          <span className="opacity-30">&middot;</span>
          <button type="button" className="cursor-pointer font-semibold text-primary">
            Use email instead
          </button>
        </div>

        <Button
          onClick={() => router.push('/sign-in/welcome')}
          disabled={formData.otpCode.length < 6}
          size="lg"
          className="mt-9 rounded-full px-10 shadow-md shadow-primary/40"
        >
          Verify &amp; continue
          <ArrowRight width={16} height={16} />
        </Button>

        <p className="mt-11 font-serif type-caption italic text-muted-foreground">
          Last sign-in: Madrid &middot; 3 days ago
        </p>
      </div>
    </div>
  )
}

const ShieldIcon = () => (
  <div className="mb-1 inline-flex size-18 items-center justify-center rounded-20 bg-primary/10">
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 8h20M8 15h4" />
    </svg>
  </div>
)
