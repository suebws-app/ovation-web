import { Badge } from "@ovation/ui/components/Badge";

type FeaturesLanguagePillProps = {
  text: string;
};

export const FeaturesLanguagePill = ({ text }: FeaturesLanguagePillProps) => (
  <Badge
    variant="outline"
    className="type-overline rounded-full px-2.5 py-1.5"
  >
    {text}
  </Badge>
);
