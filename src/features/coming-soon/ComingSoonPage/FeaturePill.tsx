type FeaturePillProps = {
  text: string;
};

export const FeaturePill = ({ text }: FeaturePillProps) => (
  <div className="rounded-12 border-border bg-card/60 flex items-center gap-3 border px-4 py-3 shadow-sm">
    <span
      className="bg-secondary size-2 shrink-0 rounded-full"
      aria-hidden="true"
    />
    <span className="type-body-small text-muted-foreground">{text}</span>
  </div>
);
