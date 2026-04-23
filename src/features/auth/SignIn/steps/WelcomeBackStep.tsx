'use client'

import { Eyebrow } from '@ovation/ui/components/Eyebrow'
import { Polaroid } from '../components/Polaroid'
import { LoaderDots } from '../components/LoaderDots'

const POLAROIDS = [
  { top: 130, left: 150, rotation: -8, initial: 'M', tint: '#EFC9A8', name: 'Margot' },
  { top: 650, left: 210, rotation: 10, initial: 'A', tint: '#EC8662', name: 'Angela' },
  { top: 120, right: 190, rotation: 7, initial: 'J', tint: '#779FEB', name: 'Joan' },
  { top: 620, right: 160, rotation: -6, initial: 'E', tint: '#82E19D', name: 'Elise' },
]

export const WelcomeBackStep = () => (
  <div className="relative flex min-h-screen items-center justify-center bg-[radial-gradient(900px_500px_at_50%_20%,_oklch(0.705_0.120_262.5/0.18),_transparent_60%),radial-gradient(700px_500px_at_10%_90%,_oklch(0.833_0.132_151.8/0.10),_transparent_60%),radial-gradient(700px_500px_at_90%_80%,_oklch(0.723_0.135_40/0.08),_transparent_60%)]">
    {POLAROIDS.map((p) => (
      <Polaroid key={p.name} {...p} />
    ))}

    <div className="relative max-w-[680px] text-center">
      <Eyebrow className="mb-4.5 tracking-[2.5px] text-primary">
        Signed in &middot; Preparing your book
      </Eyebrow>
      <h1 className="font-serif text-[3rem] font-semibold leading-none tracking-tight tablet:text-[5rem]">
        Welcome back,
        <br />
        <span className="italic text-primary">Lena &amp; Tom&aacute;s.</span>
      </h1>
      <p className="mx-auto mt-5.5 max-w-[520px] type-body-large leading-relaxed text-muted-foreground">
        Gathering <strong className="text-foreground">12 new voices</strong>,{' '}
        <strong className="text-foreground">4 new photos</strong>,
        and queueing them the way you left them.
      </p>

      <div className="mt-10">
        <LoaderDots />
      </div>
    </div>
  </div>
)
