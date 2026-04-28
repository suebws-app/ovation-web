"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";

import {
  FilterChipRail,
  type FilterChipItem,
} from "@/components/FilterChipRail";
import { useSelectionMode } from "@/lib/hooks/useSelectionMode";
import { useMessagesList, useUpdateMessage } from "@/lib/query/messagesQueries";
import { queryKeys } from "@/lib/query/keys";
import type {
  EventStats,
  MessageFilter,
  ListMessagesQuery,
  MessageDetail,
} from "@/lib/api/types";

import { messagesClient } from "@/lib/api/messages-client";
import { downloadManyMessages } from "@/lib/media/downloadMessageAssets";

import { AudioElement } from "@ovation/ui/components/AudioElement";
import { Checkbox } from "@ovation/ui/components/Checkbox";

import { MessageBatchFooter } from "./components/MessageBatchFooter";
import { MessageDayList } from "./components/MessageDayList";
import { MessageDetailPane } from "./components/MessageDetailPane";
import { MessageToolbar } from "./components/MessageToolbar";
import { toMessageRowView } from "./adapters";
import { useMessageAudioPlayer } from "./hooks/useMessageAudioPlayer";
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
  const player = useMessageAudioPlayer(eventId);
  const qc = useQueryClient();
  const router = useRouter();
  const syncedDurationsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const id = player.playingId;
    const measured = player.duration;
    if (!id || !Number.isFinite(measured) || measured <= 0) return;
    if (syncedDurationsRef.current.has(id)) return;
    const detail = qc.getQueryData<{ message: MessageDetail }>(
      queryKeys.messages.detail(eventId, id),
    );
    const stored = detail?.message.audioDurationSec ?? null;
    const rounded = Math.round(measured);
    if (stored === rounded) {
      syncedDurationsRef.current.add(id);
      return;
    }
    syncedDurationsRef.current.add(id);
    updateMessage.mutate({
      messageId: id,
      input: { audioDurationSec: rounded },
    });
  }, [player.playingId, player.duration, eventId, qc, updateMessage]);

  const anonymous = t("common__anonymous");
  const messageViews = useMemo(
    () => (data?.items ?? []).map((m) => toMessageRowView(m, anonymous)),
    [data?.items, anonymous],
  );

  const activeMessage =
    messageViews.find((m) => m.id === activeMessageId) ?? null;

  const isBelowSmallDesktop = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1023.98px)").matches;

  const allSelected =
    messageViews.length > 0 &&
    messageViews.every((m) => selection.selectedIds.has(m.id));
  const handleToggleAll = () => {
    if (allSelected) selection.clear();
    else selection.selectAll(messageViews.map((m) => m.id));
  };

  const [bulkPending, setBulkPending] = useState(false);

  const selectedViews = messageViews.filter((m) =>
    selection.selectedIds.has(m.id),
  );
  const allSelectedFavorited =
    selectedViews.length > 0 && selectedViews.every((m) => m.favorited);
  const allSelectedInGoldBook =
    selectedViews.length > 0 && selectedViews.every((m) => m.inGoldBook);

  const handleBulkFavorite = async () => {
    if (selectedViews.length === 0) return;
    const next = !allSelectedFavorited;
    setBulkPending(true);
    try {
      await Promise.all(
        selectedViews.map((m) =>
          updateMessage.mutateAsync({
            messageId: m.id,
            input: { isFavorite: next },
          }),
        ),
      );
    } finally {
      setBulkPending(false);
    }
  };

  const handleBulkAddToGoldBook = async () => {
    if (selectedViews.length === 0) return;
    const next = !allSelectedInGoldBook;
    setBulkPending(true);
    try {
      await Promise.all(
        selectedViews.map((m) =>
          updateMessage.mutateAsync({
            messageId: m.id,
            input: { isGoldBookSelected: next },
          }),
        ),
      );
    } finally {
      setBulkPending(false);
    }
  };

  const handleBulkDownload = async () => {
    setBulkPending(true);
    try {
      const ids = Array.from(selection.selectedIds);
      const inputs = await Promise.all(
        ids.map(async (id) => {
          const detailKey = queryKeys.messages.detail(eventId, id);
          let cached = qc.getQueryData<{ message: MessageDetail }>(detailKey);
          if (!cached) {
            cached = await qc.fetchQuery<{ message: MessageDetail }>({
              queryKey: detailKey,
              queryFn: () => messagesClient.get(eventId, id),
            });
          }
          return {
            guestName: cached.message.guestNames || anonymous,
            audioUrl: cached.message.audioUrl,
            videoUrl: cached.message.videoUrl,
            photoUrl: cached.message.photoUrl,
            writtenNote: cached.message.writtenNote,
          };
        }),
      );
      await downloadManyMessages(inputs, "messages");
    } finally {
      setBulkPending(false);
    }
  };

  const handleRowClick = (id: string) => {
    if (isBelowSmallDesktop()) {
      router.push(`/app/messages/${id}`);
      return;
    }
    setActiveMessageId((prev) => (prev === id ? null : id));
  };

  const handleRowPlay = (id: string) => {
    setActiveMessageId(id);
    void player.toggle(id);
  };

  const handleToggleFavorite = () => {
    if (!activeMessage) return;
    updateMessage.mutate({
      messageId: activeMessage.id,
      input: { isFavorite: !activeMessage.favorited },
    });
  };

  const handleToggleGoldBook = () => {
    if (!activeMessage) return;
    updateMessage.mutate({
      messageId: activeMessage.id,
      input: { isGoldBookSelected: !activeMessage.inGoldBook },
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
    <div className="small-desktop:flex min-h-screen">
      <div className="bg-card relative flex min-w-0 flex-1 flex-col">
        <MessageToolbar stats={stats} />
        <FilterChipRail
          chips={chipItems}
          activeLabel={activeChipLabel}
          onSelect={handleChipSelect}
          className=""
          leading={
            <Checkbox
              checked={allSelected}
              onChange={handleToggleAll}
              aria-label={t("messages__select_all")}
              className="mr-1 ml-2.5"
            />
          }
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
            selectedIds={selection.selectedIds}
            activeMessageId={activeMessage?.id ?? null}
            playingId={player.playingId}
            isPlaying={player.isPlaying}
            playingProgress={player.progress}
            playingDuration={player.duration}
            playingCurrentTime={player.currentTime}
            onRowClick={handleRowClick}
            onRowPlay={handleRowPlay}
            onRowToggleSelect={selection.toggleSelect}
          />
        )}
        <MessageBatchFooter
          count={selection.selectedIds.size}
          combinedDuration={formatDurationLong(selectedDurationSec)}
          onBulkFavorite={handleBulkFavorite}
          onBulkDownload={handleBulkDownload}
          onBulkAddToGoldBook={handleBulkAddToGoldBook}
          bulkPending={bulkPending}
          allFavorited={allSelectedFavorited}
          allInGoldBook={allSelectedInGoldBook}
        />
      </div>
      <MessageDetailPane
        eventId={eventId}
        message={activeMessage}
        onToggleFavorite={handleToggleFavorite}
        onToggleGoldBook={handleToggleGoldBook}
        togglePending={updateMessage.isPending}
        isPlayingActive={
          player.isPlaying && player.playingId === activeMessage?.id
        }
        isCurrentTrack={player.playingId === activeMessage?.id}
        progress={player.playingId === activeMessage?.id ? player.progress : 0}
        currentTime={
          player.playingId === activeMessage?.id ? player.currentTime : 0
        }
        playerDuration={
          player.playingId === activeMessage?.id ? player.duration : 0
        }
        onTogglePlay={() => {
          if (activeMessage) void player.toggle(activeMessage.id);
        }}
        onSeek={(ratio) => {
          if (player.playingId === activeMessage?.id) player.seekRatio(ratio);
        }}
      />
      <AudioElement ref={player.playerRef} src={player.src} />
    </div>
  );
};
