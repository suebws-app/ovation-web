"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Table, TableBody, TableSkeleton } from "@ovation/ui/components/Table";
import { DataDirectory } from "@/components/DataDirectory";
import type { Invitee } from "@/lib/api/types";
import { inviteesTableSkeletonColumns } from "../tableColumns";
import { InviteeRow } from "./InviteeRow";
import { InviteeSearchInput } from "./InviteeSearchInput";
import { InviteeTableHead } from "./InviteeTableHead";

type InviteeListProps = {
  eventId: string;
  invitees: Invitee[];
  isLoading: boolean;
  isError: boolean;
  actions: ReactNode;
};

export const InviteeList = ({
  eventId,
  invitees,
  isLoading,
  isError,
  actions,
}: InviteeListProps) => {
  const t = useTranslations();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return invitees;
    return invitees.filter((invitee) => {
      const name =
        `${invitee.firstName} ${invitee.lastName ?? ""}`.toLowerCase();
      const email = invitee.email?.toLowerCase() ?? "";
      return name.includes(query) || email.includes(query);
    });
  }, [invitees, search]);

  const renderBody = (): ReactNode => {
    if (isLoading) {
      return (
        <TableSkeleton
          className="table-fixed"
          columns={inviteesTableSkeletonColumns}
          rows={6}
        />
      );
    }
    if (isError) {
      return (
        <p className="type-body-small text-destructive p-8 text-center">
          {t("invitees__list__error")}
        </p>
      );
    }
    if (invitees.length === 0) {
      return (
        <p className="type-body-small text-muted-foreground p-8 text-center">
          {t("invitees__list__empty")}
        </p>
      );
    }
    if (filtered.length === 0) {
      return (
        <p className="type-body-small text-muted-foreground p-8 text-center">
          {t("invitees__directory__no_search_results", { query: search })}
        </p>
      );
    }
    return (
      <Table className="table-fixed">
        <InviteeTableHead />
        <TableBody>
          {filtered.map((invitee, i) => (
            <InviteeRow
              key={invitee.id}
              eventId={eventId}
              invitee={invitee}
              index={i}
            />
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <DataDirectory
      chips={null}
      title={
        <>
          {t("invitees__directory__title")}{" "}
          <span className="type-body-small text-muted-foreground font-medium">
            {t("invitees__directory__showing_count", {
              count: filtered.length,
            })}
          </span>
        </>
      }
      actions={
        <>
          <InviteeSearchInput value={search} onChange={setSearch} />
          {actions}
        </>
      }
    >
      {renderBody()}
    </DataDirectory>
  );
};
