"use client";

import { useEffect } from "react";
import { AudioPlayer } from "@ovation/ui/components/AudioPlayer";
import type { EventStats } from "@/lib/api/types";
import type { TAudioPlayer } from "@ovation/ui/hooks/useAudioPlayer";
import { eventsClient } from "@/lib/api/events-client";
import { MessagesFilterRail } from "./components/MessagesFilterRail";
import { MessagesListBody } from "./components/MessagesListBody";
import { ConnectedBatchFooter } from "./components/ConnectedBatchFooter";
import { ConnectedMessageDetailPane } from "./components/ConnectedMessageDetailPane";
import { MessagesStoreReset } from "./components/MessagesStoreReset";
import { MessagesActiveSync } from "./components/MessagesActiveSync";
import { MessagesEventProvider } from "./context/MessagesEventContext";
import { useAudioDurationSync } from "./hooks/useAudioDurationSync";
import { useMessageAudioPlayer } from "./hooks/useMessageAudioPlayer";
import { useActiveMessageId } from "./store/useMessagesStore";

type MessagesPageClientProps = {
  eventId: string;
  stats: EventStats | null;
};

export const MessagesPageClient = ({
  eventId,
  stats,
}: MessagesPageClientProps) => {
  const player = useMessageAudioPlayer(eventId);
  const activeMessageId = useActiveMessageId();
  const paneOpen = Boolean(activeMessageId);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("sidebar-clear-badge", { detail: { kind: "messages" } }),
    );
    eventsClient.markSeen(eventId, "messages").catch(() => undefined);
  }, [eventId]);

  return (
    <MessagesEventProvider eventId={eventId}>
      <MessagesStoreReset />
      <MessagesActiveSync />
      <DurationSync player={player} />
      <div className="flex w-full flex-1">
        <div className="bg-card relative flex w-full min-w-0 flex-1 flex-col">
          <div className="flex w-full flex-1 flex-col">
            <MessagesFilterRail stats={stats} />
            <MessagesListBody player={player} stats={stats} />
          </div>
          <ConnectedBatchFooter />
        </div>
        <div
          className={`small-desktop:block hidden overflow-hidden transition-[width] duration-300 ease-out ${
            paneOpen ? "w-105" : "w-0"
          }`}
        >
          <div className="w-105">
            <ConnectedMessageDetailPane player={player} />
          </div>
        </div>
        <AudioPlayer player={player} />
      </div>
    </MessagesEventProvider>
  );
};

const DurationSync = ({ player }: { player: TAudioPlayer }) => {
  useAudioDurationSync(player);
  return null;
};
