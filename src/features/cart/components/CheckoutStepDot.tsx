"use client";

import { cn } from "@ovation/ui/utils/cn";

type StepState = "done" | "active" | "upcoming";

type CheckoutStepDotProps = {
  index: number;
  label: string;
  state: StepState;
  isLast: boolean;
};

export const CheckoutStepDot = ({
  index,
  label,
  state,
  isLast,
}: CheckoutStepDotProps) => (
  <>
    <span
      className={cn(
        "type-caption inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold",
        state === "active" && "bg-foreground text-background",
        state === "done" && "text-foreground",
        state === "upcoming" && "text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "type-caption inline-flex size-4.5 items-center justify-center rounded-full font-bold",
          state === "active"
            ? "bg-background text-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {index + 1}
      </span>
      {label}
    </span>
    {!isLast && <span className="bg-border mx-1 h-px w-3.5" />}
  </>
);
