"use client";

import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerProps,
} from "@vidstack/react";
import type { TAudioPlayer } from "../hooks/useAudioPlayer";

type AudioPlayerProps = {
  player: TAudioPlayer;
  className?: string;
};

const buildSrc = (src: string | null): MediaPlayerProps["src"] =>
  src ? [{ src, type: "audio/mpeg" }] : "";

export const AudioPlayer = ({ player, className }: AudioPlayerProps) => {
  if (!player) return null;

  const { playerRef, src, onTimeUpdate, onDurationChange, onPlay, onPause } =
    player;

  return (
    <MediaPlayer
      ref={playerRef}
      src={buildSrc(src)}
      viewType="audio"
      streamType="on-demand"
      load="eager"
      preload="auto"
      onTimeUpdate={onTimeUpdate}
      onDurationChange={onDurationChange}
      onPlay={onPlay}
      onPause={onPause}
      onError={(detail) => {
        console.error("[audio] vidstack error", detail);
      }}
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
      className={className}
    >
      <MediaProvider />
    </MediaPlayer>
  );
};
