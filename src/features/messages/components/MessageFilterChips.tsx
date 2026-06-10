"use client";

import { useTranslations } from "next-intl";
import { Chip } from "@ovation/ui/components/Chip";
import type { MessageFilter, MessageSummary } from "@/lib/api/types";

type MessageFilterChipsProps = {
  messages: MessageSummary[];
  active: MessageFilter;
  onSelect: (filter: MessageFilter) => void;
};

const FILTERS: { value: MessageFilter; labelKey: string }[] = [
  { value: "all", labelKey: "messages__filter__all" },
  { value: "favorites", labelKey: "messages__filter__favourites" },
  { value: "with_photo", labelKey: "messages__filter__with_photo" },
  { value: "with_video", labelKey: "messages__filter__with_video" },
  { value: "audio_only", labelKey: "messages__filter__audio_only" },
];

const countFor = (msgs: MessageSummary[], filter: MessageFilter): number => {
  switch (filter) {
    case "favorites":
      return msgs.filter((m) => m.isFavorite).length;
    case "with_photo":
      return msgs.filter((m) => m.hasPhoto).length;
    case "with_video":
      return msgs.filter((m) => m.hasVideo).length;
    case "audio_only":
      return msgs.filter((m) => m.hasAudio && !m.hasPhoto && !m.hasVideo)
        .length;
    default:
      return msgs.length;
  }
};

export const MessageFilterChips = ({
  messages,
  active,
  onSelect,
}: MessageFilterChipsProps) => {
  const t = useTranslations();
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map((f) => (
        <Chip
          key={f.value}
          label={t(f.labelKey)}
          count={countFor(messages, f.value)}
          active={active === f.value}
          onClick={() => onSelect(f.value)}
        />
      ))}
    </div>
  );
};
