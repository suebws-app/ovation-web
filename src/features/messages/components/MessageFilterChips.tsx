"use client";

import { useTranslations } from "next-intl";
import { Chip } from "@ovation/ui/components/Chip";
import { useMessagesCount } from "@/lib/query/messagesQueries";
import type { EventStats, MessageFilter } from "@/lib/api/types";

type MessageFilterChipsProps = {
  eventId: string;
  active: MessageFilter;
  stats: EventStats | null;
  onSelect: (filter: MessageFilter) => void;
};

const FILTERS: { value: MessageFilter; labelKey: string }[] = [
  { value: "all", labelKey: "messages__filter__all" },
  { value: "favorites", labelKey: "messages__filter__favourites" },
  { value: "with_photo", labelKey: "messages__filter__with_photo" },
  { value: "with_video", labelKey: "messages__filter__with_video" },
  { value: "audio_only", labelKey: "messages__filter__audio_only" },
];

const statsFallback = (
  stats: EventStats | null,
  filter: MessageFilter,
): number | undefined => {
  if (!stats) return undefined;
  switch (filter) {
    case "all":
      return stats.totalMessages;
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

const MessageFilterChip = ({
  eventId,
  filter,
  labelKey,
  active,
  fallback,
  onSelect,
}: {
  eventId: string;
  filter: MessageFilter;
  labelKey: string;
  active: boolean;
  fallback: number | undefined;
  onSelect: (filter: MessageFilter) => void;
}) => {
  const t = useTranslations();
  const countQuery = useMessagesCount(eventId, {
    filter: filter === "all" ? undefined : filter,
  });
  const count = countQuery.isError
    ? fallback
    : (countQuery.data?.count ?? fallback);
  return (
    <Chip
      label={t(labelKey)}
      count={count}
      active={active}
      onClick={() => onSelect(filter)}
    />
  );
};

export const MessageFilterChips = ({
  eventId,
  active,
  stats,
  onSelect,
}: MessageFilterChipsProps) => (
  <div className="hide-scrollbar flex min-h-fit items-center gap-2 overflow-auto">
    {FILTERS.map((f) => (
      <MessageFilterChip
        key={f.value}
        eventId={eventId}
        filter={f.value}
        labelKey={f.labelKey}
        active={active === f.value}
        fallback={statsFallback(stats, f.value)}
        onSelect={onSelect}
      />
    ))}
  </div>
);
