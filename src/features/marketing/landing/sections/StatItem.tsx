type StatItemProps = {
  value: string;
  label: string;
};

export const StatItem = ({ value, label }: StatItemProps) => (
  <div className="border-border tablet:border-r px-7 py-7 last:border-r-0">
    <p className="landing-display text-primary">{value}</p>
    <p className="landing-body text-muted-foreground mt-2">{label}</p>
  </div>
);
