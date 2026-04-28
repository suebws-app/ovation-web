"use client";

import { AudioElement } from "@ovation/ui/components/AudioElement";
import type { EventStats } from "@/lib/api/types";
import type { AudioPlayer } from "@ovation/ui/hooks/useAudioPlayer";
import { MessageToolbar } from "./components/MessageToolbar";
import { MessagesFilterRail } from "./components/MessagesFilterRail";
import { MessagesListBody } from "./components/MessagesListBody";
import { ConnectedBatchFooter } from "./components/ConnectedBatchFooter";
import { ConnectedMessageDetailPane } from "./components/ConnectedMessageDetailPane";
import { MessagesStoreReset } from "./components/MessagesStoreReset";
import { MessagesEventProvider } from "./context/MessagesEventContext";
import { useAudioDurationSync } from "./hooks/useAudioDurationSync";
import { useMessageAudioPlayer } from "./hooks/useMessageAudioPlayer";

type MessagesPageClientProps = {
  eventId: string;
  stats: EventStats | null;
};

export const MessagesPageClient = ({
  eventId,
  stats,
}: MessagesPageClientProps) => {
  const player = useMessageAudioPlayer(eventId);

  return (
    <MessagesEventProvider eventId={eventId}>
      <MessagesStoreReset />
      <DurationSync player={player} />
      <div className="small-desktop:flex min-h-screen">
        <div className="bg-card relative flex min-w-0 flex-1 flex-col">
          <MessageToolbar stats={stats} />
          <MessagesFilterRail />
          <MessagesListBody player={player} />
          <ConnectedBatchFooter />
        </div>
        <ConnectedMessageDetailPane player={player} />
        <AudioElement src={player.src} />
      </div>
    </MessagesEventProvider>
  );
};

const DurationSync = ({ player }: { player: AudioPlayer }) => {
  useAudioDurationSync(player);
  return null;
};
