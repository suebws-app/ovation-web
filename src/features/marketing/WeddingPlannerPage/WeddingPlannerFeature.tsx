import type { ComponentType, SVGProps } from "react";
import { cn } from "@ovation/ui/utils/cn";

type WeddingPlannerFeatureProps = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
  iconWrapClassName: string;
  iconClassName: string;
};

export const WeddingPlannerFeature = ({
  Icon,
  title,
  body,
  iconWrapClassName,
  iconClassName,
}: WeddingPlannerFeatureProps) => (
  <div className="border-border rounded-16 bg-card border p-6">
    <div
      className={cn(
        "flex size-11 items-center justify-center rounded-full",
        iconWrapClassName,
      )}
    >
      <Icon className={cn("size-5", iconClassName)} />
    </div>
    <h3 className="type-body text-foreground mt-4 font-semibold">{title}</h3>
    <p className="text-muted-foreground type-body-small mt-2 leading-relaxed">
      {body}
    </p>
  </div>
);
