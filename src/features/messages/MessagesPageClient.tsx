"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import {
  FilterChipRail,
  type FilterChipItem,
} from "@/components/FilterChipRail";
import { SelectionToolbar } from "@/components/SelectionToolbar";
import { useSelectionMode } from "@/lib/hooks/useSelectionMode";
import { useMessagesList, useUpdateMessage } from "@/lib/query/messagesQueries";
import type {
  EventStats,
  MessageFilter,
  ListMessagesQuery,
} from "@/lib/api/types";

import { MessageBatchBar } from "./components/MessageBatchBar";
import { MessageDayList } from "./components/MessageDayList";
import { MessageDetailPane } from "./components/MessageDetailPane";
import { MessageToolbar } from "./components/MessageToolbar";
import { toMessageRowView } from "./adapters";
import { formatDurationLong } from "./utils";

type MessagesPageClientProps = {
  eventId: string;
  stats: EventStats | null;
};

const FILTER_VALUES: { labelKey: string; value: MessageFilter }[] = [
  { labelKey: "messages__filter__all", value: "all" },
  { labelKey: "messages__filter__favourites", value: "favorites" },
  { labelKey: "messages__filter__with_photo", value: "with_photo" },
  { labelKey: "messages__filter__with_video", value: "with_video" },
  { labelKey: "messages__filter__audio_only", value: "audio_only" },
];

export const MessagesPageClient = ({
  eventId,
  stats,
}: MessagesPageClientProps) => {
  const t = useTranslations();
  const selection = useSelectionMode<string>();
  const [filter, setFilter] = useState<MessageFilter>("all");
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const query: ListMessagesQuery = { filter, sort: "newest", limit: 50 };
  const { data, isPending, isError } = useMessagesList(eventId, query);
  const updateMessage = useUpdateMessage(eventId);

  const anonymous = t("common__anonymous");
  const messageViews = useMemo(
    () => (data?.items ?? []).map((m) => toMessageRowView(m, anonymous)),
    [data?.items, anonymous],
  );

  const activeMessage =
    messageViews.find((m) => m.id === activeMessageId) ??
    messageViews[0] ??
    null;

  const handleRowClick = (id: string) => {
    if (selection.selectMode) {
      selection.toggleSelect(id);
    } else {
      setActiveMessageId(id);
    }
  };

  const handleToggleFavorite = () => {
    if (!activeMessage) return;
    updateMessage.mutate({
      messageId: activeMessage.id,
      input: { isFavorite: !activeMessage.favorited },
    });
  };

  const selectedDurationSec = messageViews
    .filter((m) => selection.selectedIds.has(m.id))
    .reduce((acc, m) => acc + m.durationSec, 0);

  const filterChips = FILTER_VALUES.map((c) => ({
    label: t(c.labelKey),
    value: c.value,
  }));
  const chipItems: FilterChipItem[] = filterChips.map((c) => ({
    label: c.label,
    count:
      c.value === "all"
        ? messageViews.length
        : c.value === "favorites" && filter === "favorites"
          ? messageViews.length
          : undefined,
  }));
  const activeChipLabel =
    filterChips.find((c) => c.value === filter)?.label ?? filterChips[0].label;
  const handleChipSelect = (label: string) => {
    const next = filterChips.find((c) => c.label === label);
    if (next) setFilter(next.value);
  };

  return (
    <div className="tablet:-mb-10 desktop:-mb-20 small-desktop:grid-cols-[1fr_360px] -mx-4 -mb-6 grid min-h-screen">
      <div className="bg-card flex min-w-0 flex-col">
        <MessageToolbar stats={stats} />
        <SelectionToolbar
          selectMode={selection.selectMode}
          count={selection.selectedIds.size}
          onToggle={selection.toggleSelectMode}
          onClearAll={selection.clear}
        />
        {selection.selectMode && (
          <MessageBatchBar
            count={selection.selectedIds.size}
            combinedDuration={formatDurationLong(selectedDurationSec)}
          />
        )}
        <FilterChipRail
          chips={chipItems}
          activeLabel={activeChipLabel}
          onSelect={handleChipSelect}
          className="large-desktop:hidden"
        />
        {isPending ? (
          <p className="type-body-small text-muted-foreground p-8 text-center">
            {t("messages__loading")}
          </p>
        ) : isError ? (
          <p className="type-body-small text-destructive p-8 text-center">
            {t("messages__error")}
          </p>
        ) : messageViews.length === 0 ? (
          <p className="type-body-small text-muted-foreground p-8 text-center">
            {t("messages__no_match")}
          </p>
        ) : (
          <MessageDayList
            messages={messageViews}
            selectMode={selection.selectMode}
            selectedIds={selection.selectedIds}
            activeMessageId={activeMessage?.id ?? null}
            playingId={null}
            onRowClick={handleRowClick}
          />
        )}
      </div>
      <MessageDetailPane
        eventId={eventId}
        message={activeMessage}
        onToggleFavorite={handleToggleFavorite}
        togglePending={updateMessage.isPending}
      />
    </div>
  );
};
