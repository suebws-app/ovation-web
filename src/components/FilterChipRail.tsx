"use client";

import { Chip } from "@ovation/ui/components/Chip";
import { cn } from "@ovation/ui/utils/cn";

export type FilterChipItem = {
  label: string;
  count: number;
};

type FilterChipRailProps = {
  chips: FilterChipItem[];
  activeLabel: string;
  onSelect: (label: string) => void;
  className?: string;
};

export const FilterChipRail = ({
  chips,
  activeLabel,
  onSelect,
  className,
}: FilterChipRailProps) => (
  <div
    className={cn(
      "flex gap-2 overflow-auto border-b border-border bg-card px-4 py-3",
      className,
    )}
  >
    {chips.map((chip) => (
      <Chip
        key={chip.label}
        label={chip.label}
        count={chip.count}
        active={activeLabel === chip.label}
        onClick={() => onSelect(chip.label)}
      />
    ))}
  </div>
);
