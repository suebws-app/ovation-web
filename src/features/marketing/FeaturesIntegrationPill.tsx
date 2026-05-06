import { Badge } from "@ovation/ui/components/Badge";

type FeaturesIntegrationPillProps = {
  name: string;
};

export const FeaturesIntegrationPill = ({
  name,
}: FeaturesIntegrationPillProps) => (
  <Badge variant="outline" className="rounded-12 px-3 py-2">
    {name}
  </Badge>
);
