import type { ComponentType, SVGProps } from "react";
import { cn } from "@ovation/ui/utils/cn";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type PlannerPillarProps = {
  Icon: IconComponent;
  iconWrapClassName: string;
  iconClassName: string;
  title: string;
  description: string;
};

export const PlannerPillar = ({
  Icon,
  iconWrapClassName,
  iconClassName,
  title,
  description,
}: PlannerPillarProps) => (
  <div className="flex flex-col p-5">
    <div
      className={cn(
        "rounded-12 mb-4 flex size-11 items-center justify-center",
        iconWrapClassName,
      )}
    >
      <Icon className={cn("size-5.5", iconClassName)} />
    </div>
    <h3 className="landing-h4 text-foreground">{title}</h3>
    <p className="type-body-small text-muted-foreground mt-2">{description}</p>
  </div>
);
