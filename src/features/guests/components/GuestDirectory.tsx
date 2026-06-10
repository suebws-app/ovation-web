"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { DownloadIcon } from "@ovation/icons/DownloadIcon";
import { DataDirectory } from "@/components/DataDirectory";
import { InfiniteScrollSentinel } from "@/components/InfiniteScrollSentinel";
import {
  applyGuestFilter,
  applyGuestSearch,
  applyGuestSort,
  type GuestRow as GuestRowData,
} from "../adapters";
import {
  useGuestFilter,
  useGuestSearch,
  useGuestSelectedIds,
  useGuestSort,
  useGuestsStore,
} from "../store/useGuestsStore";
import { useGuestCsvExport } from "../hooks/useGuestCsvExport";
import { GuestFilterChips } from "./GuestFilterChips";
import { GuestRow } from "./GuestRow";
import { GuestSearchInput } from "./GuestSearchInput";
import { GuestSortButton } from "./GuestSortButton";
import { GuestTableHead } from "./GuestTableHead";

type GuestDirectoryProps = {
  guests: GuestRowData[];
  isPending: boolean;
  isError: boolean;
  isFetchingAll: boolean;
};

export const GuestDirectory = ({
  guests,
  isPending,
  isError,
  isFetchingAll,
}: GuestDirectoryProps) => {
  const t = useTranslations();
  const filter = useGuestFilter();
  const sort = useGuestSort();
  const search = useGuestSearch();
  const selectedIds = useGuestSelectedIds();
  const setFilter = useGuestsStore((s) => s.setFilter);
  const toggleSelected = useGuestsStore((s) => s.toggleSelected);
  const selectAll = useGuestsStore((s) => s.selectAll);
  const clearSelection = useGuestsStore((s) => s.clearSelection);

  const filtered = useMemo(() => {
    const f = applyGuestFilter(guests, filter);
    const s = applyGuestSearch(f, search);
    return applyGuestSort(s, sort);
  }, [guests, filter, search, sort]);

  const allSelected =
    filtered.length > 0 && filtered.every((g) => selectedIds.has(g.id));

  const handleToggleAll = () => {
    if (allSelected) clearSelection();
    else selectAll(filtered.map((g) => g.id));
  };

  const { exportCsv, isExporting } = useGuestCsvExport();

  const renderBody = () => {
    if (isPending) {
      return (
        <p className="type-body-small text-muted-foreground p-8 text-center">
          {t("common__loading")}
        </p>
      );
    }
    if (isError) {
      return (
        <p className="type-body-small text-destructive p-8 text-center">
          {t("common__error")}
        </p>
      );
    }
    if (filtered.length === 0) {
      const empty = search.trim()
        ? t("guests__directory__no_search_results", { query: search })
        : t("guests__directory__empty_body");
      return (
        <p className="type-body-small text-muted-foreground p-8 text-center">
          {empty}
        </p>
      );
    }
    return filtered.map((guest, i) => (
      <GuestRow
        key={guest.id}
        guest={guest}
        index={i}
        selected={selectedIds.has(guest.id)}
        onToggleSelect={() => toggleSelected(guest.id)}
        isLast={i === filtered.length - 1}
      />
    ));
  };

  return (
    <DataDirectory
      chips={
        <GuestFilterChips guests={guests} active={filter} onSelect={setFilter} />
      }
      title={
        <>
          {t("guests__directory__title")}{" "}
          <span className="type-body-small text-muted-foreground font-medium">
            {t("guests__directory__showing_count", { count: filtered.length })}
          </span>
        </>
      }
      actions={
        <>
          <GuestSearchInput />
          <GuestSortButton />
          <Button
            size="sm"
            className="rounded-full"
            disabled={filtered.length === 0 || isExporting}
            onClick={() => exportCsv(filtered)}
          >
            <DownloadIcon width={13} height={13} />
            {t("guests__directory__export")}
          </Button>
        </>
      }
      tableHead={
        filtered.length > 0 ? (
          <GuestTableHead
            allSelected={allSelected}
            onToggleAll={handleToggleAll}
          />
        ) : null
      }
      bottomSlot={
        <InfiniteScrollSentinel
          hasNextPage={isFetchingAll}
          isFetchingNextPage={isFetchingAll}
          onLoadMore={() => undefined}
          loadingLabel={t("guests__directory__loading_all")}
        />
      }
    >
      {renderBody()}
    </DataDirectory>
  );
};
