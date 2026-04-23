type NextStepCardProps = {
  emoji: string
  title: string
  description: string
}

export const NextStepCard = ({ emoji, title, description }: NextStepCardProps) => (
  <div className="rounded-16 border border-border bg-card p-4.5 shadow-sm">
    <span className="text-xl">{emoji}</span>
    <p className="mt-2 type-body-small font-semibold text-foreground">{title}</p>
    <p className="mt-1 type-caption leading-snug text-muted-foreground">{description}</p>
  </div>
)
