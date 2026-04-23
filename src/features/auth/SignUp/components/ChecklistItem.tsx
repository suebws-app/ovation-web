import { cn } from '@ovation/ui/utils/cn'

type ChecklistItemProps = {
  index: number
  label: string
  active?: boolean
}

export const ChecklistItem = ({ index, label, active = false }: ChecklistItemProps) => (
  <div
    className={cn(
      'flex items-center gap-3 type-body-small',
      active ? 'opacity-100' : 'opacity-70'
    )}
  >
    <span
      className={cn(
        'flex size-[22px] shrink-0 items-center justify-center rounded-full type-caption font-bold',
        active ? 'bg-destructive text-primary-foreground' : 'bg-white/15'
      )}
    >
      {index}
    </span>
    <span>{label}</span>
  </div>
)
