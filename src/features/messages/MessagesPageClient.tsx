"use client";

import { AudioMount } from "@ovation/ui/components/AudioMount";
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
      <div className="flex min-h-screen w-full flex-1">
        <div className="bg-card relative flex w-full flex-1 flex-col">
          <MessageToolbar stats={stats} />
          <MessagesFilterRail />
          <MessagesListBody player={player} />
          <ConnectedBatchFooter />
        </div>
        <ConnectedMessageDetailPane player={player} />
        <AudioMount player={player} />
      </div>
    </MessagesEventProvider>
  );
};

const DurationSync = ({ player }: { player: AudioPlayer }) => {
  useAudioDurationSync(player);
  return null;
};
