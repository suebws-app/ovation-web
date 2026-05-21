type FeaturePillProps = {
  text: string;
};

export const FeaturePill = ({ text }: FeaturePillProps) => (
  <div className="flex items-center gap-3 rounded-12 border border-border bg-card/60 px-4 py-3 shadow-sm">
    <span className="size-2 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
    <span className="type-body-small text-muted-foreground">{text}</span>
  </div>
);
