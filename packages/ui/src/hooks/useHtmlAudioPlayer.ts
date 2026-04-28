"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type PlayerState = {
  playingId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
};

const initialState: PlayerState = {
  playingId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
};

type UseHtmlAudioPlayerOptions = {
  resolveSrc: (id: string) => Promise<string | null>;
};

export type HtmlAudioPlayer = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioProps: {
    onPlay: () => void;
    onPause: () => void;
    onTimeUpdate: () => void;
    onLoadedMetadata: () => void;
    onDurationChange: () => void;
    onEnded: () => void;
  };
  playingId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  toggle: (id: string) => Promise<void>;
  seekRatio: (ratio: number) => void;
};

export const useHtmlAudioPlayer = (
  options: UseHtmlAudioPlayerOptions,
): HtmlAudioPlayer => {
  const { resolveSrc } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>(initialState);

  const toggle = useCallback(
    async (id: string) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (state.playingId === id) {
        if (audio.paused) {
          await audio.play().catch((err) => {
            console.error("[audio] play failed", err);
          });
        } else {
          audio.pause();
        }
        return;
      }

      const url = await resolveSrc(id);
      if (!url) return;
      audio.src = url;
      setState({ playingId: id, isPlaying: false, currentTime: 0, duration: 0 });
      await audio.play().catch((err) => {
        console.error("[audio] play failed", err);
      });
    },
    [resolveSrc, state.playingId],
  );

  const handlePlay = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: true }));
  }, []);
  const handlePause = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);
  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setState((s) => ({
      ...s,
      currentTime: audio.currentTime,
      duration: Number.isFinite(audio.duration) ? audio.duration : s.duration,
    }));
  }, []);
  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setState((s) => ({
      ...s,
      duration: Number.isFinite(audio.duration) ? audio.duration : 0,
    }));
  }, []);
  const handleDurationChange = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!Number.isFinite(audio.duration)) return;
    setState((s) => ({ ...s, duration: audio.duration }));
  }, []);
  const handleEnded = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: false, currentTime: 0 }));
  }, []);

  const seekRatio = useCallback((ratio: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const duration = audio.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    const clamped = Math.min(1, Math.max(0, ratio));
    audio.currentTime = clamped * duration;
    setState((s) => ({ ...s, currentTime: audio.currentTime }));
  }, []);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const progress =
    state.duration > 0
      ? Math.min(1, Math.max(0, state.currentTime / state.duration))
      : 0;

  return {
    audioRef,
    audioProps: {
      onPlay: handlePlay,
      onPause: handlePause,
      onTimeUpdate: handleTimeUpdate,
      onLoadedMetadata: handleLoadedMetadata,
      onDurationChange: handleDurationChange,
      onEnded: handleEnded,
    },
    playingId: state.playingId,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    progress,
    toggle,
    seekRatio,
  };
};
