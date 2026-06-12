"use client";

import { useTranslations } from "next-intl";
import { MessageSquareIcon } from "@ovation/icons/MessageSquareIcon";

import { AudioPlayer } from "@ovation/ui/components/AudioPlayer";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { MessageRowView } from "@/features/messages/adapters";
import { useMessageAudioPlayer } from "@/features/messages/hooks/useMessageAudioPlayer";
import { MessagesLatestRow } from "./MessagesLatestRow";

type MessagesProps = {
  eventId: string;
  messages: MessageRowView[];
  totalCount: number;
};

export const Messages = ({ eventId, messages, totalCount }: MessagesProps) => {
  const t = useTranslations();
  const latest = messages.slice(0, 2);
  const player = useMessageAudioPlayer(eventId);

  return (
    <div className="rounded-20 border-border bg-card desktop:grid-cols-[1fr_1px_1.4fr] grid min-h-62 grid-cols-1 gap-6 border p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <span className="bg-primary/10 text-primary rounded-12 inline-flex size-10 items-center justify-center">
            <MessageSquareIcon width={18} height={18} />
          </span>
        </div>
        <div>
          <p className="type-h1 font-serif font-semibold">
            {totalCount}
            <span className="type-h3 text-muted-foreground ml-2 font-sans font-normal">
              {t("dashboard__widget__messages__unit")}
            </span>
          </p>
        </div>
        <Link
          href={appRoutes.app.messages}
          className="type-body-small text-primary inline-flex items-center gap-1.5 font-semibold hover:underline"
        >
          {t("dashboard__widget__messages__open_inbox")}
        </Link>
      </div>

      <div className="bg-border desktop:block hidden w-px" aria-hidden />

      <div className="flex min-w-0 flex-col gap-3">
        <p className="type-overline text-muted-foreground tracking-[2px] uppercase">
          {t("dashboard__widget__messages__latest")}
        </p>
        {latest.length === 0 ? (
          <p className="type-body-small text-muted-foreground">
            {t("dashboard__widget__messages__empty")}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {latest.map((m) => (
              <MessagesLatestRow
                key={m.id}
                message={m}
                isPlaying={player.playingId === m.id && player.isPlaying}
                progress={player.playingId === m.id ? player.progress : 0}
                onTogglePlay={() => player.toggle(m.id)}
              />
            ))}
          </div>
        )}
      </div>
      <AudioPlayer player={player} />
    </div>
  );
};
