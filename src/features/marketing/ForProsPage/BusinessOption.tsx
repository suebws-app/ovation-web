"use client";

import { type ComponentType, type SVGProps } from "react";
import { cn } from "@ovation/ui/utils/cn";

type BusinessOptionProps = {
  businessKey: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  isSelected: boolean;
  panelId: string;
  onSelect: (businessKey: string) => void;
};

export const BusinessOption = ({
  businessKey,
  label,
  Icon,
  isSelected,
  panelId,
  onSelect,
}: BusinessOptionProps) => (
  <button
    type="button"
    role="tab"
    aria-selected={isSelected}
    aria-controls={panelId}
    onClick={() => onSelect(businessKey)}
    className={cn(
      "rounded-12 border-border bg-card focus-visible:ring-ring flex w-full cursor-pointer items-center gap-3 border p-4 text-left transition focus-visible:ring-2 focus-visible:outline-none",
      isSelected
        ? "border-primary shadow-sm"
        : "hover:border-primary/40 hover:bg-warm-panel/30",
    )}
  >
    <span
      className={cn(
        "rounded-8 flex size-9 shrink-0 items-center justify-center transition",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-primary-soft/40 text-primary",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </span>
    <span className="text-foreground type-body font-semibold">{label}</span>
  </button>
);
