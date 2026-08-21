import type { ComponentType } from "react";
import { cn } from "@ovation/ui/utils/cn";

type PlannerPillarCardProps = {
  Icon: ComponentType<{ className?: string }>;
  iconClassName: string;
  iconWrapClassName: string;
  title: string;
  body: string;
};

export const PlannerPillarCard = ({
  Icon,
  iconClassName,
  iconWrapClassName,
  title,
  body,
}: PlannerPillarCardProps) => (
  <div className="rounded-16 border-border border p-5">
    <span
      className={cn(
        "rounded-12 grid size-10 place-items-center",
        iconWrapClassName,
      )}
    >
      <Icon className={cn("size-5", iconClassName)} />
    </span>
    <h3 className="type-body text-foreground mt-3.5 font-semibold">{title}</h3>
    <p className="type-body-small text-muted-foreground mt-1.5">{body}</p>
  </div>
);
