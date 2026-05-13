"use client";

import { useTranslations } from "next-intl";
import { FilterTab } from "./FilterTab";

export const KEEPSAKE_FILTERS = [
  "all",
  "printed",
  "digital",
  "physical",
  "gifts",
] as const;

export type KeepsakeFilter = (typeof KEEPSAKE_FILTERS)[number];

const LABEL_KEY: Record<KeepsakeFilter, string> = {
  all: "keepsakes__filter__all",
  printed: "keepsakes__filter__printed",
  digital: "keepsakes__filter__digital",
  physical: "keepsakes__filter__physical",
  gifts: "keepsakes__filter__gifts",
};

type FilterTabsProps = {
  active: KeepsakeFilter;
  onChange: (filter: KeepsakeFilter) => void;
};

export const FilterTabs = ({ active, onChange }: FilterTabsProps) => {
  const t = useTranslations();
  return (
    <div className="flex gap-1.5 overflow-auto">
      {KEEPSAKE_FILTERS.map((key) => (
        <FilterTab
          key={key}
          label={t(LABEL_KEY[key])}
          active={active === key}
          onClick={() => onChange(key)}
        />
      ))}
    </div>
  );
};
