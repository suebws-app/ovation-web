"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@ovation/ui/components/Checkbox";

type GuestTableHeadProps = {
  allSelected: boolean;
  onToggleAll: () => void;
};

export const GuestTableHead = ({
  allSelected,
  onToggleAll,
}: GuestTableHeadProps) => {
  const t = useTranslations();
  const columns = [
    { label: t("guests__table__col_guest"), hideMobile: false },
    { label: t("guests__table__col_messages"), hideMobile: true },
    { label: t("guests__table__col_status"), hideMobile: true },
    { label: t("guests__table__col_last_seen"), hideMobile: true },
    { label: "", hideMobile: true },
  ];
  return (
    <div className="border-border bg-background tablet:grid-cols-[28px_minmax(220px,1.4fr)_120px_140px_180px_36px] tablet:gap-3.5 tablet:px-6 grid grid-cols-[28px_1fr_36px] items-center gap-3 border-b px-4 py-3">
      <Checkbox
        checked={allSelected}
        onChange={onToggleAll}
        aria-label={t("guests__select_all")}
      />
      {columns.map((col, i) => (
        <div
          key={`${col.label}-${i}`}
          className={`type-overline text-muted-foreground ${col.hideMobile ? "tablet:block hidden" : ""}`}
        >
          {col.label}
        </div>
      ))}
    </div>
  );
};
