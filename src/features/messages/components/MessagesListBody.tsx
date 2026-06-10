"use client";

import { useTranslations } from "next-intl";
import type { TAudioPlayer } from "@ovation/ui/hooks/useAudioPlayer";
import type { EventStats } from "@/lib/api/types";
import { useMessageList } from "../hooks/useMessageList";
import { useFilter } from "../store/useMessagesStore";
import { ConnectedMessageDayList } from "./ConnectedMessageDayList";

type Props = {
  player: TAudioPlayer;
  stats: EventStats | null;
};

export const MessagesListBody = ({ player, stats }: Props) => {
  const t = useTranslations();
  const filter = useFilter();
  const { messageViews, isPending, isError } = useMessageList();

  if (isPending) {
    return (
      <p className="type-body-small text-muted-foreground animate-fade-in p-8 text-center">
        {t("messages__loading")}
      </p>
    );
  }

  if (isError) {
    return (
      <p className="type-body-small text-destructive animate-fade-in p-8 text-center">
        {t("messages__error")}
      </p>
    );
  }

  if (messageViews.length === 0) {
    if (!stats || stats.totalMessages === 0) return null;
    return (
      <p className="type-body-small text-muted-foreground animate-fade-in p-8 text-center">
        {t("messages__no_match")}
      </p>
    );
  }

  return (
    <div key={filter} className="animate-fade-in">
      <ConnectedMessageDayList player={player} />
    </div>
  );
};
