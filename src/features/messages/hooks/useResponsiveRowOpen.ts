"use client";

import type { AudioPlayer } from "@ovation/ui/hooks/useAudioPlayer";
import { useRouter } from "@/i18n/navigation";
import { useMessagesStore } from "../store/useMessagesStore";

const isBelowSmallDesktop = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 1023.98px)").matches;

export const useResponsiveRowOpen = (player: AudioPlayer) => {
  const router = useRouter();
  const setActiveMessageId = useMessagesStore((s) => s.setActiveMessageId);

  const openRow = (id: string) => {
    if (isBelowSmallDesktop()) {
      router.push(`/app/messages/${id}`);
      return;
    }
    setActiveMessageId(id);
  };

  const playRow = (id: string) => {
    setActiveMessageId(id);
    void player.toggle(id);
  };

  return { openRow, playRow };
};
