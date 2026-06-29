"use client";

import { useTranslations } from "next-intl";
import { TableHead, TableHeader, TableRow } from "@ovation/ui/components/Table";
import { inviteesTableColumnClasses } from "../tableColumns";

export const InviteeTableHead = () => {
  const t = useTranslations();
  return (
    <TableHeader>
      <TableRow>
        <TableHead className={inviteesTableColumnClasses.guest}>
          {t("invitees__table__col_guest")}
        </TableHead>
        <TableHead className={inviteesTableColumnClasses.email}>
          {t("invitees__table__col_email")}
        </TableHead>
        <TableHead className={inviteesTableColumnClasses.phone}>
          {t("invitees__table__col_phone")}
        </TableHead>
        <TableHead className={inviteesTableColumnClasses.seats}>
          {t("invitees__table__col_seats")}
        </TableHead>
        <TableHead className={inviteesTableColumnClasses.status}>
          {t("invitees__table__col_status")}
        </TableHead>
        <TableHead className={inviteesTableColumnClasses.actions}>
          {t("invitees__list__actions_label")}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
