"use client";

import { useState } from "react";
import { cn } from "@ovation/ui/utils/cn";

const FILTERS = ["All", "Printed", "Digital", "Physical", "Gifts"];

type FilterTabsProps = {
  onChange?: (filter: string) => void;
};

export const FilterTabs = ({ onChange }: FilterTabsProps) => {
  const [active, setActive] = useState("All");

  const handleClick = (filter: string) => {
    setActive(filter);
    onChange?.(filter);
  };

  return (
    <div className="flex gap-1.5 overflow-auto">
      {FILTERS.map((f) => (
        <FilterTab
          key={f}
          label={f}
          active={active === f}
          onClick={() => handleClick(f)}
        />
      ))}
    </div>
  );
};

const FilterTab = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "type-caption cursor-pointer rounded-full px-3 py-1.5 font-semibold whitespace-nowrap transition-colors",
      active
        ? "bg-foreground text-background"
        : "border-border bg-card text-muted-foreground hover:bg-muted border",
    )}
  >
    {label}
  </button>
);
