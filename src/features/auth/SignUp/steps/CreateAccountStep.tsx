'use client'

import { Button } from '@ovation/ui/components/Button'
import { Input } from '@ovation/ui/components/Input'
import { Label } from '@ovation/ui/components/Label'
import { Checkbox } from '@ovation/ui/components/Checkbox'
import { Separator } from '@ovation/ui/components/Separator'
import { Eyebrow } from '@ovation/ui/components/Eyebrow'
import { ArrowRight } from '@ovation/icons/ArrowRight'
import { SplitLayout } from '../components/SplitLayout'
import { SocialAuthButtons } from '../../components/SocialAuthButtons'
import { ChecklistItem } from '../components/ChecklistItem'
import { useSignUpStore } from '../useSignUpStore'
import { Link, useRouter } from '@/i18n/navigation'

const SETUP_STEPS = [
  'Create your account',
  'Name your book',
  'Cover photo & link',
  'Choose a plan',
]

export const CreateAccountStep = () => {
  const { formData, updateFormData } = useSignUpStore()
  const router = useRouter()

  return (
    <SplitLayout
      left={<BrandContent />}
      right={
        <>
          <Eyebrow className="mb-3 text-primary">Step 1 &middot; Create account</Eyebrow>
          <h1 className="font-serif text-[2.75rem] font-semibold leading-tight tracking-tight">
            Start your
            <br />
            <span className="italic text-primary">wedding book.</span>
          </h1>
          <p className="mt-3 type-body-small leading-relaxed text-muted-foreground">
            Free to start. Upgrade when your guest list is final — or never.
          </p>

          <SocialAuthButtons action="sign-up" className="mt-8" />

          <Separator label="or with email" className="my-6" />

          <div className="space-y-5">
            <div>
              <Label htmlFor="email" className="mb-2">Your email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-2">Create a password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData({ password: e.target.value })}
                placeholder="8+ characters"
              />
              <p className="mt-2 type-caption text-muted-foreground">
                8+ characters. We'll never share this — not even with your partner.
              </p>
            </div>
          </div>

          <Checkbox
            checked={formData.agreedToTerms}
            onChange={(checked) => updateFormData({ agreedToTerms: checked })}
            label={
              <span>
                I agree to the{' '}
                <Link href="/terms" className="font-semibold text-primary">Terms</Link> and{' '}
                <Link href="/privacy" className="font-semibold text-primary">Privacy Policy</Link>.
              </span>
            }
            className="mt-6"
          />

          <Button
            onClick={() => router.push('/sign-up/step/2')}
            disabled={!formData.email || !formData.password || !formData.agreedToTerms}
            size="lg"
            className="mt-6 w-full rounded-full shadow-md shadow-primary/40"
          >
            Continue
            <ArrowRight width={16} height={16} />
          </Button>

          <p className="mt-4.5 text-center type-body-small text-muted-foreground">
            Already have a book?{' '}
            <Link href="/sign-in" className="font-semibold text-foreground">
              Sign in &rarr;
            </Link>
          </p>
        </>
      }
    />
  )
}

const BrandContent = () => (
  <>
    <Eyebrow className="relative tracking-[2.5px] opacity-80">Let&apos;s begin</Eyebrow>
    <p className="relative font-serif text-5xl font-medium leading-tight tracking-tight">
      We&apos;ll walk you through it — names, date, cover photo, URL, a plan.
      You can change any of it later.
    </p>
    <div className="relative flex flex-col gap-3.5">
      {SETUP_STEPS.map((label, i) => (
        <ChecklistItem key={label} index={i + 1} label={label} active={i === 0} />
      ))}
    </div>
  </>
)

