"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { PlusIcon } from "@ovation/icons/PlusIcon";
import { Button } from "@ovation/ui/components/Button";
import { Table, TableBody, TableSkeleton } from "@ovation/ui/components/Table";
import { DataDirectory } from "@/components/DataDirectory";
import type { Invitee } from "@/lib/api/types";
import { inviteesTableSkeletonColumns } from "../tableColumns";
import { InviteeRow } from "./InviteeRow";
import { InviteeDraftRow } from "./InviteeDraftRow";
import { InviteeSearchInput } from "./InviteeSearchInput";
import { InviteeTableHead } from "./InviteeTableHead";

type InviteeListProps = {
  eventId: string;
  invitees: Invitee[];
  isLoading: boolean;
  isError: boolean;
};

export const InviteeList = ({
  eventId,
  invitees,
  isLoading,
  isError,
}: InviteeListProps) => {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);

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

  const renderTable = () => (
    <Table className="table-fixed">
      <InviteeTableHead />
      <TableBody>
        {adding ? (
          <InviteeDraftRow eventId={eventId} onDone={() => setAdding(false)} />
        ) : null}
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
    if (adding || filtered.length > 0) {
      return renderTable();
    }
    if (invitees.length === 0) {
      return (
        <p className="type-body-small text-muted-foreground p-8 text-center">
          {t("invitees__list__empty")}
        </p>
      );
    }
    return (
      <p className="type-body-small text-muted-foreground p-8 text-center">
        {t("invitees__directory__no_search_results", { query: search })}
      </p>
    );
  };

  return (
    <DataDirectory
      chips={null}
      title={<InviteeSearchInput value={search} onChange={setSearch} />}
      actions={
        <Button
          type="button"
          size="sm"
          onClick={() => setAdding(true)}
          disabled={adding}
        >
          <PlusIcon width={13} height={13} />
          {t("invitees__form__add_cta")}
        </Button>
      }
    >
      {renderBody()}
    </DataDirectory>
  );
};
