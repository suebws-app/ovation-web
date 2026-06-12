"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import { TableHead, TableHeader, TableRow } from "@ovation/ui/components/Table";
import { messagesTableColumnClasses } from "../tableColumns";

type MessageTableHeadProps = {
  allSelected: boolean;
  onToggleAll: () => void;
};

export const MessageTableHead = ({
  allSelected,
  onToggleAll,
}: MessageTableHeadProps) => {
  const t = useTranslations();
  return (
    <TableHeader>
      <TableRow>
        <TableHead className={messagesTableColumnClasses.checkbox}>
          <Checkbox
            checked={allSelected}
            onChange={onToggleAll}
            aria-label={t("messages__select_all")}
          />
        </TableHead>
        <TableHead className={messagesTableColumnClasses.message}>
          {t("messages__table__col_message")}
        </TableHead>
        <TableHead className={messagesTableColumnClasses.type}>
          {t("messages__table__col_type")}
        </TableHead>
        <TableHead className={messagesTableColumnClasses.date}>
          {t("messages__table__col_date")}
        </TableHead>
        <TableHead className={messagesTableColumnClasses.audio} />
      </TableRow>
    </TableHeader>
  );
};
