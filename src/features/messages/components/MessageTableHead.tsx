"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@ovation/ui/components/Checkbox";

type MessageTableHeadProps = {
  allSelected: boolean;
  onToggleAll: () => void;
};

export const MessageTableHead = ({
  allSelected,
  onToggleAll,
}: MessageTableHeadProps) => {
  const t = useTranslations();
  const columns = [
    { label: t("messages__table__col_message"), hideUntil: "" },
    {
      label: t("messages__table__col_type"),
      hideUntil: "@[740px]/table:block hidden",
    },
    {
      label: t("messages__table__col_date"),
      hideUntil: "@[740px]/table:block hidden",
    },
    { label: "", hideUntil: "@[740px]/table:block hidden" },
  ];
  return (
    <div className="border-border bg-background grid grid-cols-[28px_1fr_44px] items-center gap-3 border-b px-4 py-3 @[740px]/table:grid-cols-[28px_minmax(180px,1.4fr)_80px_110px_120px] @[740px]/table:gap-3.5 @[740px]/table:px-6 @[1420px]/table:grid-cols-[28px_minmax(180px,1.4fr)_80px_110px_280px]">
      <Checkbox
        checked={allSelected}
        onChange={onToggleAll}
        aria-label={t("messages__select_all")}
      />
      {columns.map((col, i) => (
        <div
          key={`${col.label}-${i}`}
          className={`type-overline text-muted-foreground ${col.hideUntil}`}
        >
          {col.label}
        </div>
      ))}
    </div>
  );
};
