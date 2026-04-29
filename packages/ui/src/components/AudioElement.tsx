"use client";

import { MediaPlayer, MediaProvider, type MediaPlayerProps } from "@vidstack/react";
import type { AudioPlayer } from "../hooks/useAudioPlayer";
import { cn } from "../utils/cn";

type AudioElementProps = {
  player: AudioPlayer;
  className?: string;
};

const buildSrc = (src: string | null): MediaPlayerProps["src"] =>
  src ? [{ src, type: "audio/mpeg" }] : "";

export const AudioElement = ({ player, className }: AudioElementProps) => (
  <MediaPlayer
    ref={player.playerRef}
    src={buildSrc(player.src)}
    viewType="audio"
    streamType="on-demand"
    onTimeUpdate={player.onTimeUpdate}
    onDurationChange={player.onDurationChange}
    onPlay={player.onPlay}
    onPause={player.onPause}
    onError={(detail) => {
      console.error("[audio] vidstack error", detail);
    }}
    style={{
      position: "absolute",
      width: 0,
      height: 0,
      overflow: "hidden",
      pointerEvents: "none",
    }}
    className={cn("hidden", className)}
  >
    <MediaProvider />
  </MediaPlayer>
);
