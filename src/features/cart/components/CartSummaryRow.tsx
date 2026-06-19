"use client";

import type { ReactNode } from "react";
import { cn } from "@ovation/ui/utils/cn";

type CartSummaryRowProps = {
  label: string;
  value: ReactNode;
  emphasis?: "default" | "positive";
  helper?: string;
};

export const CartSummaryRow = ({
  label,
  value,
  emphasis = "default",
  helper,
}: CartSummaryRowProps) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-muted-foreground type-body-small inline-flex items-center gap-2">
      {label}
      {helper && (
        <span className="bg-secondary/20 text-secondary-foreground type-caption rounded-full px-2 py-0.5 font-bold">
          {helper}
        </span>
      )}
    </span>
    <span
      className={cn(
        "type-body-small font-mono font-semibold",
        emphasis === "positive" && "text-secondary",
      )}
    >
      {value}
    </span>
  </div>
);
