type FeaturesIntegrationPillProps = {
  name: string;
};

export const FeaturesIntegrationPill = ({
  name,
}: FeaturesIntegrationPillProps) => (
  <span className="border-border bg-card rounded-xl border px-3 py-2 text-xs font-medium">
    {name}
  </span>
);
