import { StatItem } from './StatItem'

const STATS = [
  { value: '87', label: 'messages' },
  { value: '64', label: 'photos' },
  { value: '1h 42m', label: 'of voices' },
  { value: '14', label: 'favourites' },
]

export const StatLine = () => (
  <div className="grid grid-cols-2 gap-6 border-b border-border py-5 pb-8 tablet:flex tablet:gap-14">
    {STATS.map((s) => (
      <StatItem key={s.label} value={s.value} label={s.label} />
    ))}
  </div>
)
