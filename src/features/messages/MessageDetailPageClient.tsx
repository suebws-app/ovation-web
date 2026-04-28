"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft } from "@ovation/icons/ChevronLeft";
import { useRouter } from "@/i18n/navigation";
import {
  useMessageDetail,
  useUpdateMessage,
} from "@/lib/query/messagesQueries";
import { AudioElement } from "@ovation/ui/components/AudioElement";
import { MessageDetailPane } from "./components/MessageDetailPane";
import { useMessageAudioPlayer } from "./hooks/useMessageAudioPlayer";
import {
  formatDurationShort,
  initialsFrom,
  tintFrom,
  waveFrom,
  formatTimeShort,
} from "./adapters";
import type { MessageRowView } from "./adapters";

type MessageDetailPageClientProps = {
  eventId: string;
  messageId: string;
};

export const MessageDetailPageClient = ({
  eventId,
  messageId,
}: MessageDetailPageClientProps) => {
  const t = useTranslations();
  const router = useRouter();
  const { data: detail } = useMessageDetail(eventId, messageId);
  const updateMessage = useUpdateMessage(eventId);
  const player = useMessageAudioPlayer(eventId);

  if (!detail) {
    return (
      <p className="type-body-small text-muted-foreground p-8 text-center">
        {t("messages__loading")}
      </p>
    );
  }

  const m = detail.message;
  const anonymous = t("common__anonymous");
  const message: MessageRowView = {
    id: m.id,
    name: m.guestNames || anonymous,
    relation: "",
    quote: m.transcript ? m.transcript.slice(0, 120) : "",
    initials: initialsFrom(m.guestNames),
    tint: tintFrom(m.id),
    duration: formatDurationShort(m.audioDurationSec),
    durationSec: m.audioDurationSec ?? 0,
    favorited: m.isFavorite,
    inGoldBook: m.isGoldBookSelected,
    hasAudio: Boolean(m.audioUrl),
    hasPhoto: Boolean(m.photoUrl),
    listens: 0,
    time: formatTimeShort(m.createdAt),
    createdAt: m.createdAt,
    wave: waveFrom(m.id),
  };

  const handleToggleFavorite = () =>
    updateMessage.mutate({
      messageId,
      input: { isFavorite: !m.isFavorite },
    });

  const handleToggleGoldBook = () =>
    updateMessage.mutate({
      messageId,
      input: { isGoldBookSelected: !m.isGoldBookSelected },
    });

  return (
    <div className="-mx-4 -mb-6 flex min-h-screen flex-col">
      <button
        type="button"
        onClick={() => router.back()}
        className="border-border bg-card text-foreground hover:bg-muted/50 type-body-small flex cursor-pointer items-center gap-1 border-b px-4 py-3 text-left font-semibold"
      >
        <ChevronLeft width={16} height={16} />
        {t("messages__detail__back")}
      </button>
      <MessageDetailPane
        eventId={eventId}
        message={message}
        onToggleFavorite={handleToggleFavorite}
        onToggleGoldBook={handleToggleGoldBook}
        togglePending={updateMessage.isPending}
        isPlayingActive={player.isPlaying && player.playingId === messageId}
        isCurrentTrack={player.playingId === messageId}
        progress={player.playingId === messageId ? player.progress : 0}
        currentTime={player.playingId === messageId ? player.currentTime : 0}
        playerDuration={player.playingId === messageId ? player.duration : 0}
        onTogglePlay={() => void player.toggle(messageId)}
        onSeek={(ratio) => {
          if (player.playingId === messageId) player.seekRatio(ratio);
        }}
        fullScreen
      />
      <AudioElement ref={player.playerRef} src={player.src} />
    </div>
  );
};
