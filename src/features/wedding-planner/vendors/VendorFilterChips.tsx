"use client";

import { useTranslations } from "next-intl";
import { Chip } from "@ovation/ui/components/Chip";
import type { PlannerVendor, VendorStatus } from "@/lib/api/types";

export type VendorFilter = VendorStatus | "all";

type VendorFilterChipsProps = {
  vendors: PlannerVendor[];
  active: VendorFilter;
  onSelect: (filter: VendorFilter) => void;
};

const FILTERS: { value: VendorFilter; labelKey: string }[] = [
  { value: "all", labelKey: "messages__filter__all" },
  { value: "Shortlist", labelKey: "wp__vendors__s_shortlist" },
  { value: "In talks", labelKey: "wp__vendors__s_intalks" },
  { value: "Booked", labelKey: "wp__vendors__s_booked" },
];

const countFor = (vendors: PlannerVendor[], filter: VendorFilter): number =>
  filter === "all"
    ? vendors.length
    : vendors.filter((vendor) => vendor.status === filter).length;

export const VendorFilterChips = ({
  vendors,
  active,
  onSelect,
}: VendorFilterChipsProps) => {
  const t = useTranslations();

  return (
    <div className="hide-scrollbar flex min-h-fit items-center gap-2 overflow-auto">
      {FILTERS.map((f) => (
        <Chip
          key={f.value}
          label={t(f.labelKey)}
          count={countFor(vendors, f.value)}
          active={active === f.value}
          onClick={() => onSelect(f.value)}
        />
      ))}
    </div>
  );
};
