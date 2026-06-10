"use client";

import { Avatar, AvatarFallback } from "@ovation/ui/components/Avatar";
import { Waveform } from "@ovation/ui/components/Waveform";
import { PlayIcon } from "@ovation/icons/PlayIcon";
import { PauseIcon } from "@ovation/icons/PauseIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { MessageRowView } from "@/features/messages/adapters";

type MessagesLatestRowProps = {
  message: MessageRowView;
  isPlaying: boolean;
  progress: number;
  onTogglePlay: () => void;
};

export const MessagesLatestRow = ({
  message,
  isPlaying,
  progress,
  onTogglePlay,
}: MessagesLatestRowProps) => (
  <div className="hover:bg-muted/40 rounded-12 -mx-2 flex items-center gap-3 px-2 py-2 transition-colors">
    <Link
      href={`${appRoutes.app.messages}?active=${message.id}`}
      className="flex min-w-0 flex-1 items-center gap-3"
    >
      <Avatar size="lg">
        <AvatarFallback
          className="type-caption text-primary-foreground font-semibold"
          style={{ background: message.tint }}
        >
          {message.initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="type-body-small truncate font-semibold">
            {message.name}
          </p>
          <span className="type-caption text-muted-foreground font-mono">
            {message.time}
          </span>
        </div>
        {(message.note || message.quote) && (
          <p className="type-caption text-muted-foreground mt-0.5 truncate italic">
            &ldquo;{message.note || message.quote}&rdquo;
          </p>
        )}
        {message.hasAudio && (
          <Waveform
            bars={message.wave.slice(0, 28)}
            height={18}
            progress={progress}
            className="mt-1.5"
          />
        )}
      </div>
    </Link>
    {message.hasAudio && (
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
      >
        {isPlaying ? (
          <PauseIcon width={12} height={12} />
        ) : (
          <PlayIcon width={12} height={12} />
        )}
      </button>
    )}
  </div>
);
