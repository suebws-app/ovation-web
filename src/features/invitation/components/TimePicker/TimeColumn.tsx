"use client";

import { TimeOptionItem } from "./TimeOptionItem";

type TimeColumnProps = {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  ariaLabel: string;
};

export const TimeColumn = ({
  options,
  selected,
  onSelect,
  ariaLabel,
}: TimeColumnProps) => {
  return (
    <div
      role="listbox"
      aria-label={ariaLabel}
      className="rounded-12 max-h-56 overflow-y-auto p-1"
    >
      <div className="flex flex-col gap-0.5">
        {options.map((option) => (
          <TimeOptionItem
            key={option}
            option={option}
            selected={option === selected}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};
