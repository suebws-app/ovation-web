"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import { TableHead, TableHeader, TableRow } from "@ovation/ui/components/Table";
import { guestsTableColumnClasses } from "../tableColumns";

type GuestTableHeadProps = {
  allSelected: boolean;
  onToggleAll: () => void;
};

export const GuestTableHead = ({
  allSelected,
  onToggleAll,
}: GuestTableHeadProps) => {
  const t = useTranslations();
  return (
    <TableHeader>
      <TableRow>
        <TableHead className={guestsTableColumnClasses.checkbox}>
          <Checkbox
            checked={allSelected}
            onChange={onToggleAll}
            aria-label={t("guests__select_all")}
          />
        </TableHead>
        <TableHead className={guestsTableColumnClasses.guest}>
          {t("guests__table__col_guest")}
        </TableHead>
        <TableHead className={guestsTableColumnClasses.messages}>
          {t("guests__table__col_messages")}
        </TableHead>
        <TableHead className={guestsTableColumnClasses.status}>
          {t("guests__table__col_status")}
        </TableHead>
        <TableHead className={guestsTableColumnClasses.lastSeen}>
          {t("guests__table__col_last_seen")}
        </TableHead>
        <TableHead className={guestsTableColumnClasses.spacer} />
      </TableRow>
    </TableHeader>
  );
};
