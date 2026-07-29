import { cn } from "@ovation/ui/utils/cn";
import { clampPct } from "../utils";

type ProgressBarProps = {
  pct: number;
  fillClassName?: string;
  fillColor?: string;
  className?: string;
};

export const ProgressBar = ({
  pct,
  fillClassName,
  fillColor,
  className,
}: ProgressBarProps) => (
  <div className={cn("bg-muted h-2 overflow-hidden rounded-full", className)}>
    <div
      className={cn(
        "bg-primary h-full rounded-full transition-[width] duration-500 ease-out",
        fillClassName,
      )}
      style={{
        width: `${clampPct(pct)}%`,
        ...(fillColor ? { backgroundColor: fillColor } : {}),
      }}
    />
  </div>
);
