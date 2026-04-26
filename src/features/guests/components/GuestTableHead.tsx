"use client";

import { useTranslations } from "next-intl";

export const GuestTableHead = () => {
  const t = useTranslations();
  const columns = [
    "",
    t("guests__table__col_guest"),
    t("guests__table__col_group_table"),
    t("guests__table__col_contact"),
    t("guests__table__col_status"),
    t("guests__table__col_activity"),
    "",
  ];
  return (
    <div className="border-border bg-background grid grid-cols-[28px_minmax(220px,1.4fr)_140px_150px_150px_120px_36px] items-center gap-3.5 border-b px-6 py-3">
      {columns.map((col, i) => (
        <div
          key={`${col}-${i}`}
          className="type-overline text-muted-foreground"
        >
          {col}
        </div>
      ))}
    </div>
  );
};
