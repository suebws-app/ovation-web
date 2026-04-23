type PolaroidProps = {
  top: number
  left?: number
  right?: number
  rotation: number
  initial: string
  name: string
  tint: string
}

export const Polaroid = ({
  top,
  left,
  right,
  rotation,
  initial,
  name,
  tint,
}: PolaroidProps) => (
  <div
    className="absolute w-[130px] rounded-4 bg-card p-2 pb-7 shadow-lg"
    style={{ top, left, right, transform: `rotate(${rotation}deg)` }}
  >
    <div
      className="flex h-[130px] w-full items-center justify-center rounded-sm font-serif text-4xl font-semibold text-primary-foreground"
      style={{ background: `linear-gradient(160deg, ${tint}, ${tint}AA)` }}
    >
      {initial}
    </div>
    <p className="absolute right-0 bottom-2 left-0 text-center font-serif type-caption italic text-muted-foreground">
      {name}
    </p>
  </div>
)
