"use client";

import { Avatar } from "@ovation/ui/components/Avatar";
import { Heart } from "@ovation/icons/Heart";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { Play } from "@ovation/icons/Play";
import { Pause } from "@ovation/icons/Pause";
import { Waveform } from "@/features/dashboard/components/Waveform";

import type { MessageMock } from "../mocks";

type MessageRowProps = {
  message: MessageMock;
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
    className={`grid w-full cursor-pointer grid-cols-[48px_1fr_48px] items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors tablet:grid-cols-[48px_1fr_100px_50px_36px] tablet:gap-4 tablet:px-6 ${
      selected
        ? "border-l-3 border-l-primary bg-primary/5"
        : "border-l-3 border-l-transparent hover:bg-muted/50"
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
        <span className="type-body font-semibold text-foreground">
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
          <span className="rounded-4 bg-primary/10 px-1.5 py-0.5 type-caption font-bold uppercase tracking-wider text-primary">
            {message.language}
          </span>
        )}
        {message.hasPhoto && (
          <ImageIcon
            width={12}
            height={12}
            className="text-muted-foreground"
          />
        )}
      </div>
      <p className="type-caption text-muted-foreground">{message.relation}</p>
      <p className="mt-1 truncate font-serif type-body-small italic text-muted-foreground">
        &ldquo;{message.quote}&rdquo;
      </p>
    </div>

    <div className="hidden tablet:block">
      <Waveform
        bars={message.wave.slice(0, 24)}
        height={28}
        progress={playing ? 0.42 : 0}
      />
    </div>

    <span className="hidden font-mono type-caption text-muted-foreground tablet:block tablet:text-right">
      {message.duration}
    </span>

    <PlayButton playing={playing} />
  </button>
);

const PlayButton = ({ playing }: { playing?: boolean }) => (
  <div
    className={`flex size-9 items-center justify-center rounded-full ${
      playing
        ? "bg-destructive text-primary-foreground shadow-[0_0_0_4px_oklch(0.723_0.135_40/0.15)]"
        : "border border-border bg-card text-foreground"
    }`}
  >
    {playing ? (
      <Pause width={13} height={13} />
    ) : (
      <Play width={13} height={13} />
    )}
  </div>
);
