"use client";

import { Avatar, AvatarFallback } from "@ovation/ui/components/Avatar";
import { MessagePlayButton } from "@/features/messages/components/MessagePlayButton";
import { formatSec } from "@/lib/utils/formatTime";
import { Waveform } from "./Waveform";

type MessageRowProps = {
  name: string;
  relation: string;
  quote: string;
  initials: string;
  tint: string;
  wave: number[];
  index: number;
  hasAudio: boolean;
  playing: boolean;
  progress: number;
  duration: string;
  currentTime: number;
  onPlay: () => void;
  onSelect: () => void;
};

export const MessageRow = ({
  name,
  relation,
  quote,
  initials,
  tint,
  wave,
  index,
  hasAudio,
  playing,
  progress,
  duration,
  currentTime,
  onPlay,
  onSelect,
}: MessageRowProps) => (
  <div
    className="hover:bg-muted/50 tablet:grid tablet:grid-cols-[56px_1fr_100px_60px_36px] tablet:items-center tablet:gap-4 tablet:px-6 tablet:py-5 flex cursor-pointer items-center gap-3 px-4 py-4 transition-colors"
    style={{ borderTop: index === 0 ? "none" : "1px solid var(--border)" }}
    role="button"
    tabIndex={0}
    onClick={onSelect}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect();
      }
    }}
  >
    <Avatar size="lg" className={index % 2 ? "rotate-2" : "-rotate-2"}>
      <AvatarFallback
        className="type-body-small text-primary-foreground font-semibold"
        style={{ background: tint }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
    <div className="min-w-0 flex-1">
      <p className="type-body-large font-serif font-semibold">
        {name}
        {relation && (
          <span className="type-body-small text-muted-foreground ml-2.5 font-medium">
            {relation}
          </span>
        )}
      </p>
      {quote && (
        <p className="type-body-small text-muted-foreground mt-0.5 truncate font-serif italic">
          &ldquo;{quote}&rdquo;
        </p>
      )}
    </div>
    {hasAudio ? (
      <Waveform
        bars={wave.slice(0, 24)}
        height={28}
        progress={progress}
        className="tablet:flex hidden justify-end"
      />
    ) : (
      <span className="tablet:block hidden" />
    )}
    <span className="type-caption text-muted-foreground tablet:block hidden text-right font-mono">
      {hasAudio ? `${formatSec(currentTime)}/${duration}` : ""}
    </span>
    {hasAudio ? (
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onPlay();
          }
        }}
        aria-label={playing ? "Pause message" : "Play message"}
        className="inline-flex"
      >
        <MessagePlayButton playing={playing} />
      </span>
    ) : (
      <span />
    )}
  </div>
);
