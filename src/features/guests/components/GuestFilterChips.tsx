"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Chip } from "@ovation/ui/components/Chip";
import { Sort } from "@ovation/icons/Sort";

export const GuestFilterChips = () => {
  const t = useTranslations();
  const chips = [
    { label: t("guests__chips__all"), count: 112 },
    { label: t("guests__chips__contributed"), count: 78 },
    { label: t("guests__chips__still"), count: 34 },
    { label: t("guests__chips__thank_owed"), count: 47 },
    { label: t("guests__chips__favourited"), count: 14 },
    { label: t("guests__chips__with_photo"), count: 63 },
    { label: t("guests__chips__no_email"), count: 8 },
  ];
  const [activeFilter, setActiveFilter] = useState(chips[0].label);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
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
        {t("guests__chips__sort_recent")}
      </button>
    </div>
  );
};
