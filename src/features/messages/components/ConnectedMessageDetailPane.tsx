"use client";

import type { TAudioPlayer } from "@ovation/ui/hooks/useAudioPlayer";
import { useRouter } from "@/i18n/navigation";
import { useEventId } from "../context/MessagesEventContext";
import { useMessageActions } from "../hooks/useMessageActions";
import { useMessagesStore } from "../store/useMessagesStore";
import { MessageDetailPane } from "./MessageDetailPane";

type Props = {
  player: TAudioPlayer;
  fullScreen?: boolean;
};

export const ConnectedMessageDetailPane = ({ player, fullScreen }: Props) => {
  const eventId = useEventId();
  const router = useRouter();
  const setActiveMessageId = useMessagesStore((s) => s.setActiveMessageId);
  const { activeMessage, toggleFavorite, toggleGoldBook, isPending } =
    useMessageActions();

  const handleClose = () => {
    if (fullScreen) router.back();
    else setActiveMessageId(null);
  };

  const isCurrentTrack =
    activeMessage !== null && player.playingId === activeMessage.id;

  return (
    <MessageDetailPane
      eventId={eventId}
      message={activeMessage}
      onToggleFavorite={toggleFavorite}
      onToggleGoldBook={toggleGoldBook}
      togglePending={isPending}
      isPlayingActive={player.isPlaying && isCurrentTrack}
      isCurrentTrack={isCurrentTrack}
      progress={isCurrentTrack ? player.progress : 0}
      currentTime={isCurrentTrack ? player.currentTime : 0}
      playerDuration={isCurrentTrack ? player.duration : 0}
      onTogglePlay={() => {
        if (activeMessage) void player.toggle(activeMessage.id);
      }}
      onSeek={(ratio) => {
        if (isCurrentTrack) player.seekRatio(ratio);
      }}
      fullScreen={fullScreen}
      onClose={activeMessage ? handleClose : undefined}
    />
  );
};
