import { Play } from '@ovation/icons/Play'
import { Check } from '@ovation/icons/Check'

type WaveformBarProps = { height: number }

const WaveformBar = ({ height }: WaveformBarProps) => (
  <div className="flex-1 rounded-full bg-primary/40" style={{ height: `${height}px` }} />
)

export const HeroShowpiece = () => {
  const waveHeights = [
    18, 28, 14, 36, 22, 40, 16, 30, 44, 20, 34, 12, 38, 24, 42,
    18, 32, 26, 44, 14, 36, 20, 40, 28, 16, 38, 22, 44, 18, 30,
    12, 34, 26, 42, 20, 38, 16, 32, 28, 44, 14, 36, 22, 18,
  ]

  return (
    <div className="relative h-[620px] w-full">
      <div
        className="absolute top-8 left-4 z-[1] rotate-[-9deg] rounded-2xl bg-card border border-border shadow-xl overflow-hidden w-48"
      >
        <div className="relative h-36 bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
          <span className="font-serif text-6xl font-semibold text-foreground/70 italic">M</span>
        </div>
        <div className="p-3 bg-card">
          <p className="text-xs text-muted-foreground font-medium">Margot · 2:22</p>
        </div>
      </div>

      <div
        className="absolute top-4 left-44 z-[4] rotate-[4deg] flex items-center gap-2 bg-card border border-border rounded-full px-3 py-2 shadow-lg"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Check />
        </span>
        <div>
          <p className="text-xs font-semibold text-foreground leading-none">Just arrived</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Abuela Carmen · 1:47</p>
        </div>
      </div>

      <div
        className="absolute top-28 left-[88px] z-[3] w-[440px] rounded-2xl bg-card border border-border shadow-2xl p-5"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-destructive to-destructive/60">
            <span className="font-serif text-base font-semibold text-primary-foreground">MD</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground leading-tight">Margot Devreese</p>
            <p className="text-xs text-muted-foreground mt-0.5">Maid of honour · 2 days after</p>
          </div>
        </div>

        <blockquote className="mt-4 font-serif italic text-sm leading-relaxed text-foreground/80">
          &ldquo;You&rsquo;ve built something so beautiful together — watching you both today, I kept thinking how lucky I am to call you my dearest friend. Here&rsquo;s to every ordinary Tuesday that follows.&rdquo;
        </blockquote>

        <div className="mt-4 flex items-center gap-3">
          <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition">
            <Play width={14} height={14} />
          </button>
          <div className="flex flex-1 items-end gap-px h-11">
            {waveHeights.map((h, i) => (
              <WaveformBar key={i} height={h} />
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-10 right-4 z-[2] rotate-[7deg] rounded-2xl bg-card border border-border shadow-xl overflow-hidden w-44"
      >
        <div className="relative h-32 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <span className="font-serif text-5xl font-semibold text-primary-foreground/80 italic">J</span>
        </div>
        <div className="p-3 bg-card">
          <p className="text-xs text-muted-foreground font-medium">Joan, father of the bride</p>
        </div>
      </div>
    </div>
  )
}
