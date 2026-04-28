"use client";

import { useCallback, useRef, useState } from "react";
import { useMediaStore, type MediaPlayerInstance } from "@vidstack/react";

type UseAudioPlayerOptions = {
  resolveSrc: (id: string) => Promise<string | null>;
};

export type AudioPlayer = {
  playerRef: React.RefObject<MediaPlayerInstance | null>;
  src: string | null;
  playingId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  toggle: (id: string) => Promise<void>;
  seekRatio: (ratio: number) => void;
};

const waitForCanPlay = (player: MediaPlayerInstance) =>
  new Promise<void>((resolve) => {
    if (player.state.canPlay) {
      resolve();
      return;
    }
    const off = player.listen("can-play", () => {
      off();
      resolve();
    });
  });

export const useAudioPlayer = (options: UseAudioPlayerOptions): AudioPlayer => {
  const { resolveSrc } = options;
  const playerRef = useRef<MediaPlayerInstance | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [src, setSrc] = useState<string | null>(null);

  const { paused, currentTime, duration } = useMediaStore(playerRef);

  const safeDuration = Number.isFinite(duration) ? duration : 0;
  const safeCurrentTime = Number.isFinite(currentTime) ? currentTime : 0;
  const isPlaying = playingId !== null && !paused;
  const progress =
    safeDuration > 0
      ? Math.min(1, Math.max(0, safeCurrentTime / safeDuration))
      : 0;

  const toggle = useCallback(
    async (id: string) => {
      const player = playerRef.current;
      if (!player) return;

      if (playingId === id) {
        if (player.paused) {
          await player.play().catch((err) => {
            console.error("[audio] play failed", err);
          });
        } else {
          player.pause();
        }
        return;
      }

      const url = await resolveSrc(id);
      if (!url) return;

      setSrc(url);
      setPlayingId(id);
      await waitForCanPlay(player);
      await player.play().catch((err) => {
        console.error("[audio] play failed", err);
      });
    },
    [resolveSrc, playingId],
  );

  const seekRatio = useCallback((ratio: number) => {
    const player = playerRef.current;
    if (!player) return;
    const dur = player.duration;
    if (!Number.isFinite(dur) || dur <= 0) return;
    const clamped = Math.min(1, Math.max(0, ratio));
    player.currentTime = clamped * dur;
  }, []);

  return {
    playerRef,
    src,
    playingId,
    isPlaying,
    currentTime: safeCurrentTime,
    duration: safeDuration,
    progress,
    toggle,
    seekRatio,
  };
};
