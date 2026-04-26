import { cn } from "@ovation/ui/utils/cn";
import { Check } from "@ovation/icons/Check";

type PricingFeatureProps = {
  feat: string;
  highlighted: boolean;
};

export const PricingFeature = ({ feat, highlighted }: PricingFeatureProps) => (
  <li className="flex items-start gap-2.5 text-sm">
    <span className={cn(highlighted ? "text-destructive" : "text-primary")}>
      <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2.2} />
    </span>
    {feat}
  </li>
);
