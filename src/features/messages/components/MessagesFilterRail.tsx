"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import { Button } from "@ovation/ui/components/Button";
import { DownloadIcon } from "@ovation/icons/DownloadIcon";
import {
  FilterChipRail,
  type FilterChipItem,
} from "@/components/FilterChipRail";
import type { EventStats, MessageFilter } from "@/lib/api/types";
import { useMessagesList } from "@/lib/query/messagesQueries";
import {
  useFilter,
  useMessageSearch,
  useMessageSelectAll,
  useMessagesStore,
} from "../store/useMessagesStore";
import { useEventId } from "../context/MessagesEventContext";
import { useExportAllMessages } from "../hooks/useExportAllMessages";

type MessagesFilterRailProps = {
  stats: EventStats | null;
};

const FILTER_VALUES: { labelKey: string; value: MessageFilter }[] = [
  { labelKey: "messages__filter__all", value: "all" },
  { labelKey: "messages__filter__favourites", value: "favorites" },
  { labelKey: "messages__filter__with_photo", value: "with_photo" },
  { labelKey: "messages__filter__with_video", value: "with_video" },
  { labelKey: "messages__filter__audio_only", value: "audio_only" },
];

export const MessagesFilterRail = ({ stats }: MessagesFilterRailProps) => {
  const t = useTranslations();
  const filter = useFilter();
  const search = useMessageSearch();
  const setFilter = useMessagesStore((s) => s.setFilter);
  const setSelectAll = useMessagesStore((s) => s.setSelectAll);
  const selectAll = useMessageSelectAll();
  const clearSelection = useMessagesStore((s) => s.clearSelection);
  const eventId = useEventId();
  const { exportAll, isExporting } = useExportAllMessages();
  const allQuery = useMessagesList(eventId, {
    filter: "all",
    sort: "newest",
    limit: 50,
  });
  const allLoadedCount = allQuery.data?.items.length ?? 0;

  const filterChips = FILTER_VALUES.map((c) => ({
    label: t(c.labelKey),
    value: c.value,
  }));

  const totalAllCount = Math.max(allLoadedCount, stats?.totalMessages ?? 0);

  const countForChip = (value: MessageFilter): number | undefined => {
    if (value === "all") return totalAllCount;
    if (!stats) return undefined;
    switch (value) {
      case "favorites":
        return stats.favorites;
      case "with_photo":
        return stats.photoCount;
      case "with_video":
        return stats.videoCount;
      case "audio_only":
        return stats.audioMessages;
      default:
        return undefined;
    }
  };

  const chipItems: FilterChipItem[] = filterChips.map((c) => ({
    label: c.label,
    count: countForChip(c.value),
  }));

  const activeChipLabel =
    filterChips.find((c) => c.value === filter)?.label ?? filterChips[0].label;

  const handleChipSelect = (label: string) => {
    const next = filterChips.find((c) => c.label === label);
    if (next) setFilter(next.value);
  };

  const allSelected = selectAll !== null;

  const handleToggleAll = () => {
    if (allSelected) {
      clearSelection();
      return;
    }
    const trimmed = search.trim();
    clearSelection();
    setSelectAll({
      filter,
      search: trimmed || undefined,
      excludedIds: [],
    });
  };

  if (totalAllCount === 0) return null;

  return (
    <FilterChipRail
      className="border-0 bg-transparent px-0 py-0"
      chips={chipItems}
      activeLabel={activeChipLabel}
      onSelect={handleChipSelect}
      leading={
        <Checkbox
          checked={allSelected}
          onChange={handleToggleAll}
          aria-label={t("messages__select_all")}
          className="mr-1 ml-2.5"
        />
      }
      trailing={
        <Button
          size="sm"
          disabled={isExporting}
          onClick={exportAll}
          className="rounded-10 bg-foreground text-background hover:bg-foreground/90 h-9"
        >
          <DownloadIcon width={13} height={13} />
          {t("messages__toolbar__export_all")}
        </Button>
      }
    />
  );
};
