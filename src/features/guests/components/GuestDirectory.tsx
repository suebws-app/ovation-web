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
  useGuestSelectAll,
  useGuestSelectedIds,
  useGuestSort,
  useGuestsStore,
} from "../store/useGuestsStore";
import { useGuestBulkActions } from "../hooks/useGuestBulkActions";
import { GuestFilterChips } from "./GuestFilterChips";
import { GuestRow } from "./GuestRow";
import { GuestSearchInput } from "./GuestSearchInput";
import { GuestSortButton } from "./GuestSortButton";
import { GuestTableHead } from "./GuestTableHead";

type GuestDirectoryProps = {
  eventId: string;
  guests: GuestRowData[];
  isPending: boolean;
  isError: boolean;
  isFetchingAll: boolean;
};

export const GuestDirectory = ({
  eventId,
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
  const selectAll = useGuestSelectAll();
  const setFilter = useGuestsStore((s) => s.setFilter);
  const toggleSelected = useGuestsStore((s) => s.toggleSelected);
  const setSelectAll = useGuestsStore((s) => s.setSelectAll);
  const clearSelection = useGuestsStore((s) => s.clearSelection);

  const filtered = useMemo(() => {
    const f = applyGuestFilter(guests, filter);
    const s = applyGuestSearch(f, search);
    return applyGuestSort(s, sort);
  }, [guests, filter, search, sort]);

  const selectAllActive = selectAll !== null;
  const allSelected = selectAllActive;

  const handleToggleAll = () => {
    if (selectAllActive) {
      clearSelection();
      return;
    }
    const trimmed = search.trim();
    clearSelection();
    setSelectAll({
      filter,
      search: trimmed || undefined,
      excludedGuestNames: [],
    });
  };

  const isGuestSelected = (id: string): boolean => {
    if (selectAll) return !selectAll.excludedGuestNames.includes(id);
    return selectedIds.has(id);
  };

  const handleRowToggle = (id: string) => {
    if (!selectAll) {
      toggleSelected(id);
      return;
    }
    const excluded = new Set(selectAll.excludedGuestNames);
    if (excluded.has(id)) excluded.delete(id);
    else excluded.add(id);
    setSelectAll({ ...selectAll, excludedGuestNames: [...excluded] });
  };

  const { exportCsv, isExporting } = useGuestBulkActions(eventId);

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
        selected={isGuestSelected(guest.id)}
        onToggleSelect={() => handleRowToggle(guest.id)}
        isLast={i === filtered.length - 1}
      />
    ));
  };

  return (
    <DataDirectory
      chips={
        <GuestFilterChips
          guests={guests}
          active={filter}
          onSelect={setFilter}
        />
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
            onClick={() => exportCsv()}
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
