"use client";

import { Avatar } from "@ovation/ui/components/Avatar";
import { Heart } from "@ovation/icons/Heart";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { Waveform } from "@/features/dashboard/components/Waveform";

import type { MessageRowView } from "../adapters";
import { MessagePlayButton } from "./MessagePlayButton";

type MessageRowProps = {
  message: MessageRowView;
  selected?: boolean;
  playing?: boolean;
  index: number;
  onClick?: () => void;
};

export const MessageRow = ({
  message,
  selected,
  playing,
  index,
  onClick,
}: MessageRowProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`border-border tablet:grid-cols-[48px_1fr_100px_50px_36px] tablet:gap-4 tablet:px-6 grid w-full cursor-pointer grid-cols-[48px_1fr_48px] items-center gap-3 border-b px-4 py-3 text-left transition-colors ${
      selected
        ? "border-l-primary bg-primary/5 border-l-3"
        : "hover:bg-muted/50 border-l-3 border-l-transparent"
    }`}
  >
    <Avatar
      initials={message.initials}
      tint={message.tint}
      size="lg"
      className={index % 2 ? "rotate-2" : "-rotate-2"}
    />

    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <span className="type-body text-foreground font-semibold">
          {message.name}
        </span>
        {message.favorited && (
          <Heart
            width={13}
            height={13}
            className="fill-destructive text-destructive"
          />
        )}
        {message.language && (
          <span className="rounded-4 bg-primary/10 type-caption text-primary px-1.5 py-0.5 font-bold tracking-wider uppercase">
            {message.language}
          </span>
        )}
        {message.hasPhoto && (
          <ImageIcon width={12} height={12} className="text-muted-foreground" />
        )}
      </div>
      {message.relation && (
        <p className="type-caption text-muted-foreground">{message.relation}</p>
      )}
      {message.quote && (
        <p className="type-body-small text-muted-foreground mt-1 truncate font-serif italic">
          &ldquo;{message.quote}&rdquo;
        </p>
      )}
    </div>

    <div className="tablet:block hidden">
      <Waveform
        bars={message.wave.slice(0, 24)}
        height={28}
        progress={playing ? 0.42 : 0}
      />
    </div>

    <span className="type-caption text-muted-foreground tablet:block tablet:text-right hidden font-mono">
      {message.duration}
    </span>

    <MessagePlayButton playing={playing} />
  </button>
);
