'use client'

import { Button } from '@ovation/ui/components/Button'
import { Eyebrow } from '@ovation/ui/components/Eyebrow'
import { ArrowRight } from '@ovation/icons/ArrowRight'
import { Clock } from '@ovation/icons/Clock'
import { SplitLayout } from '../components/SplitLayout'
import { BookPreview } from '../components/BookPreview'
import { CoverOption } from '../components/CoverOption'
import { useSignUpStore } from '../useSignUpStore'
import { useRouter } from '@/i18n/navigation'

const COVER_OPTIONS = [
  { id: 'upload', tint: '', label: 'Upload your own', isUpload: true },
  { id: 'coastal', tint: '#B9C9D9', label: 'Coastal' },
  { id: 'garden', tint: '#B8D3B6', label: 'Garden' },
  { id: 'terracotta', tint: '#EFC9A8', label: 'Terracotta' },
  { id: 'lavender', tint: '#C8B5D9', label: 'Lavender' },
  { id: 'rose', tint: '#E9BFC4', label: 'Rose' },
]

export const CoverPhotoStep = () => {
  const { formData, updateFormData } = useSignUpStore()
  const router = useRouter()

  return (
    <SplitLayout
      left={
        <>
          <Eyebrow className="relative tracking-[2.5px] opacity-80">Cover preview</Eyebrow>
          <div className="relative">
            <BookPreview
              partner1={formData.partner1Name}
              partner2={formData.partner2Name}
              date={formData.weddingDate?.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
              venue={formData.venue}
              coverImage={
                formData.coverType && formData.coverType !== 'upload' ? (
                  <CoverPattern tint={COVER_OPTIONS.find((o) => o.id === formData.coverType)?.tint ?? '#EFC9A8'} />
                ) : undefined
              }
            />
          </div>
          <p className="relative max-w-[360px] type-body-small leading-relaxed opacity-85">
            Your cover photo sets the tone of every guest screen. You can upload anything —
            an engagement shot, a picture of the venue, a favourite place. Or pick a tone for now.
          </p>
        </>
      }
      right={
        <>
          <Eyebrow className="mb-3 text-primary">Step 4 &middot; Cover photo</Eyebrow>
          <h1 className="font-serif text-[2.75rem] font-semibold leading-tight tracking-tight">
            Pick a
            <br />
            <span className="italic text-primary">first look.</span>
          </h1>
          <p className="mt-3 type-body-small leading-relaxed text-muted-foreground">
            Upload your own or choose a placeholder — you can change it whenever.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-3">
            {COVER_OPTIONS.map((option) => (
              <CoverOption
                key={option.id}
                label={option.label}
                tint={option.tint}
                isUpload={option.isUpload}
                selected={formData.coverType === option.id}
                initials={`${formData.partner1Name?.[0] ?? 'L'}&${formData.partner2Name?.[0] ?? 'T'}`}
                onClick={() => updateFormData({ coverType: option.id })}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2.5 type-body-small text-muted-foreground">
            <Clock width={14} height={14} />
            Skip for now — you have until 14 days before the wedding
          </div>

          <Button
            onClick={() => router.push('/sign-up/step/5')}
            size="lg"
            className="mt-6 w-full rounded-full shadow-md shadow-primary/40"
          >
            Continue
            <ArrowRight width={16} height={16} />
          </Button>
        </>
      }
    />
  )
}

const CoverPattern = ({ tint }: { tint: string }) => (
  <div
    className="size-full"
    style={{
      background: `repeating-linear-gradient(135deg, ${tint} 0 10px, color-mix(in oklch, ${tint}, #000 10%) 10px 20px)`,
    }}
  />
)
