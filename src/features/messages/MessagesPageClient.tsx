"use client";

import { useEffect } from "react";
import { AudioPlayer } from "@ovation/ui/components/AudioPlayer";
import type { EventStats } from "@/lib/api/types";
import type { TAudioPlayer } from "@ovation/ui/hooks/useAudioPlayer";
import { FeaturePageLayout } from "@/components/FeaturePageLayout";
import { eventsClient } from "@/lib/api/events-client";
import { ConnectedBatchFooter } from "./components/ConnectedBatchFooter";
import { ConnectedMessageDetailPane } from "./components/ConnectedMessageDetailPane";
import { MessagesStoreReset } from "./components/MessagesStoreReset";
import { MessagesActiveSync } from "./components/MessagesActiveSync";
import { MessagesEventProvider } from "./context/MessagesEventContext";
import { useAudioDurationSync } from "./hooks/useAudioDurationSync";
import { useMessageAudioPlayer } from "./hooks/useMessageAudioPlayer";
import { useActiveMessageId } from "./store/useMessagesStore";
import { MessagesDirectory } from "./MessagesDirectory";

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
      <FeaturePageLayout
        batchFooter={<ConnectedBatchFooter />}
        detailPane={<ConnectedMessageDetailPane player={player} />}
        detailPaneOpen={paneOpen}
      >
        <MessagesDirectory player={player} stats={stats} />
      </FeaturePageLayout>
      <AudioPlayer player={player} />
    </MessagesEventProvider>
  );
};

const DurationSync = ({ player }: { player: TAudioPlayer }) => {
  useAudioDurationSync(player);
  return null;
};
