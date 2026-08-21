"use client";

import { cn } from "@ovation/ui/utils/cn";

type TimeOptionItemProps = {
  option: string;
  selected: boolean;
  onSelect: (option: string) => void;
};

export const TimeOptionItem = ({
  option,
  selected,
  onSelect,
}: TimeOptionItemProps) => {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={() => onSelect(option)}
      className={cn(
        "type-body-small rounded-8 w-full px-3 py-1.5 text-center tabular-nums transition-colors",
        selected
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-muted",
      )}
    >
      {option}
    </button>
  );
};
