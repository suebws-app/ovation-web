import { cn } from '@ovation/ui/utils/cn'

type WaveformProps = {
  bars?: number[]
  barCount?: number
  height?: number
  progress?: number
  className?: string
}

export const Waveform = ({
  bars,
  barCount = 32,
  height = 28,
  progress = 0,
  className,
}: WaveformProps) => {
  const data = bars ?? Array.from({ length: barCount }, () => Math.random())
  const filledCount = Math.floor(data.length * progress)

  return (
    <div className={cn('flex items-center gap-[2px]', className)}>
      {data.map((h, i) => (
        <WaveformBar
          key={i}
          height={Math.max(h * height, 3)}
          filled={i < filledCount}
        />
      ))}
    </div>
  )
}

const WaveformBar = ({ height, filled }: { height: number; filled: boolean }) => (
  <span
    className={cn(
      'w-[2.5px] rounded-full transition-colors',
      filled ? 'bg-primary' : 'bg-primary/20'
    )}
    style={{ height }}
  />
)
