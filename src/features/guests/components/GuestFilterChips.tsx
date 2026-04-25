"use client";

import { useState } from "react";
import { Chip } from "@ovation/ui/components/Chip";
import { Sort } from "@ovation/icons/Sort";

const CHIPS = [
  { label: "All guests", count: 112 },
  { label: "Contributed", count: 78 },
  { label: "Still to hear", count: 34 },
  { label: "Thank-you owed", count: 47 },
  { label: "Favourited by you", count: 14 },
  { label: "With photo", count: 63 },
  { label: "No email yet", count: 8 },
];

export const GuestFilterChips = () => {
  const [activeFilter, setActiveFilter] = useState("All guests");

  return (
    <div className="flex flex-wrap items-center gap-2">
      {CHIPS.map((chip) => (
        <Chip
          key={chip.label}
          label={chip.label}
          count={chip.count}
          active={activeFilter === chip.label}
          onClick={() => setActiveFilter(chip.label)}
        />
      ))}
      <button
        type="button"
        className="border-border bg-card type-caption text-muted-foreground ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 font-semibold"
      >
        <Sort width={13} height={13} />
        Most recent first
      </button>
    </div>
  );
};
