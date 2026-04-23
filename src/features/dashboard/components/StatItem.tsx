type StatItemProps = {
  value: string
  label: string
}

export const StatItem = ({ value, label }: StatItemProps) => (
  <div>
    <p className="font-serif text-[2rem] font-semibold leading-none">{value}</p>
    <p className="mt-1.5 type-body-small text-muted-foreground">{label}</p>
  </div>
)
