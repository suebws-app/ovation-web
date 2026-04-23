'use client'

import { Button } from '@ovation/ui/components/Button'
import { Eyebrow } from '@ovation/ui/components/Eyebrow'
import { ArrowRight } from '@ovation/icons/ArrowRight'

type FeaturedProductProps = {
  price: number
}

export const FeaturedProduct = ({ price }: FeaturedProductProps) => (
  <div
    className="relative grid items-center gap-7 overflow-hidden rounded-24 p-6 tablet:p-8 desktop:grid-cols-[1fr_360px]"
    style={{ background: 'linear-gradient(135deg, #F6D9A3, #E5A54A)' }}
  >
    <span className="absolute top-5 right-6 type-overline tracking-[2px] text-black/55">
      &#9733; Most ordered
    </span>
    <div>
      <Eyebrow className="tracking-[2px] text-black/55">
        The Gold Book &middot; &euro;{price}
      </Eyebrow>
      <h2 className="mt-2 font-serif text-[2rem] font-semibold leading-none tablet:text-[2.375rem]">
        Every voice,
        <br />
        printed in gold.
      </h2>
      <p className="mt-3 max-w-[420px] type-body-small leading-relaxed text-black/75">
        A 112-page hand-bound photo book. Every quote gets a QR code to play the guest&apos;s voice.
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {['112 pages', 'QR per quote', 'Linen \u00b7 gold foil'].map((b) => (
          <FeaturePill key={b} label={b} />
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
          Open editor <ArrowRight width={13} height={13} />
        </Button>
        <span className="type-caption text-black/65">Ships in 2&ndash;3 wks &middot; free EU delivery</span>
      </div>
    </div>
    <BookMock />
  </div>
)

const FeaturePill = ({ label }: { label: string }) => (
  <span className="rounded-full bg-white/50 px-2.5 py-1.5 type-caption font-semibold">
    {label}
  </span>
)

const BookMock = () => (
  <div
    className="hidden rounded-6 bg-card p-5 shadow-lg desktop:block"
    style={{ transform: 'perspective(900px) rotateY(-10deg) rotateX(2deg)' }}
  >
    <p className="font-serif type-overline tracking-[3px] text-muted-foreground">
      Chapter III &middot; Family
    </p>
    <p className="mt-2.5 font-serif type-body-large font-semibold italic leading-snug text-foreground">
      &ldquo;You kept looking at her during the ceremony like you were checking she was real. She is.&rdquo;
    </p>
    <div className="mt-3.5 flex items-center gap-2.5">
      <div className="flex size-11 items-center justify-center rounded-4 font-serif font-semibold text-black/45" style={{ background: '#B8D3B6' }}>
        MB
      </div>
      <div>
        <p className="type-caption font-semibold">Marco Benedetti</p>
        <p className="type-caption text-muted-foreground">Tom&aacute;s&apos;s brother &middot; 22:58</p>
      </div>
    </div>
    <p className="absolute right-3 bottom-2 font-mono type-caption text-muted-foreground">p. 42</p>
  </div>
)
