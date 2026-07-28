import { cn } from "@ovation/ui/utils/cn";
import { StatusPill, type PillTone } from "../components/StatusPill";

export type StageState = "done" | "current" | "next";

type StageRowProps = {
  label: string;
  state: StageState;
  stateLabel: string;
};

const symbol: Record<StageState, string> = {
  done: "✓",
  current: "●",
  next: "○",
};

const pillTone: Record<StageState, PillTone> = {
  done: "sage",
  current: "primary",
  next: "neutral",
};

const iconColor: Record<StageState, string> = {
  done: "text-secondary-foreground",
  current: "text-primary",
  next: "text-muted-foreground",
};

export const StageRow = ({ label, state, stateLabel }: StageRowProps) => (
  <div className="border-border/60 flex items-center gap-3 border-b py-2.5 last:border-0">
    <span
      className={cn(
        "type-caption flex size-6 shrink-0 items-center justify-center rounded-full",
        state === "current" && "bg-primary/15",
        iconColor[state],
      )}
    >
      {symbol[state]}
    </span>
    <span
      className={cn(
        "type-body-small flex-1",
        state === "current" && "font-semibold",
        state === "next" && "text-muted-foreground",
      )}
    >
      {label}
    </span>
    <StatusPill tone={pillTone[state]}>{stateLabel}</StatusPill>
  </div>
);
