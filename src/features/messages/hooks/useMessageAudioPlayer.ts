"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAudioPlayer } from "@ovation/ui/hooks/useAudioPlayer";
import type { TAudioPlayer } from "@ovation/ui/hooks/useAudioPlayer";
import { messagesClient } from "@/lib/api/messages-client";
import { queryKeys } from "@/lib/query/keys";

export const useMessageAudioPlayer = (eventId: string): TAudioPlayer => {
  const qc = useQueryClient();

  const resolveSrc = useCallback(
    async (messageId: string): Promise<string | null> => {
      const result = await qc.fetchQuery({
        queryKey: queryKeys.messages.detail(eventId, messageId),
        queryFn: () => messagesClient.get(eventId, messageId),
      });
      return result?.message.audioUrl ?? null;
    },
    [eventId, qc],
  );

  return useAudioPlayer({ resolveSrc });
};
