import { type ReactNode } from "react";
import { cn } from "@ovation/ui/utils/cn";
import { StepBadge } from "./StepBadge";
import { StepChecklist } from "./StepChecklist";

type StepRowProps = {
  number: number;
  stepLabel: string;
  title: string;
  description: string;
  bullets?: string[];
  action?: ReactNode;
  visual: ReactNode;
  visualFirst?: boolean;
};

export const StepRow = ({
  number,
  stepLabel,
  title,
  description,
  bullets,
  action,
  visual,
  visualFirst = false,
}: StepRowProps) => (
  <div className="tablet:grid-cols-2 tablet:gap-16 grid grid-cols-1 items-center gap-10">
    <div className={cn("flex flex-col", visualFirst && "tablet:order-2")}>
      <StepBadge number={number} label={stepLabel} />
      <h3 className="landing-h2 text-foreground mt-4">{title}</h3>
      <p className="landing-body-large text-muted-foreground mt-4 max-w-140">
        {description}
      </p>
      {bullets && <StepChecklist items={bullets} />}
      {action && <div className="mt-8 flex flex-wrap gap-3">{action}</div>}
    </div>

    <div className={cn("flex justify-center", visualFirst && "tablet:order-1")}>
      {visual}
    </div>
  </div>
);
