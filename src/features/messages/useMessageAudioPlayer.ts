"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { messagesClient } from "@/lib/api/messages-client";
import { queryKeys } from "@/lib/query/keys";
import type { MessageDetail } from "@/lib/api/types";

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

export const useMessageAudioPlayer = (eventId: string) => {
  const qc = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>(initialState);

  const ensureAudioUrl = useCallback(
    async (messageId: string): Promise<string | null> => {
      const key = queryKeys.messages.detail(eventId, messageId);
      const cached = qc.getQueryData<{ message: MessageDetail }>(key);
      if (cached?.message.audioUrl) return cached.message.audioUrl;
      const fetched = await qc.fetchQuery<{ message: MessageDetail }>({
        queryKey: key,
        queryFn: () => messagesClient.get(eventId, messageId),
      });
      return fetched.message.audioUrl;
    },
    [eventId, qc],
  );

  const toggle = useCallback(
    async (messageId: string) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (state.playingId === messageId) {
        if (audio.paused) {
          await audio.play().catch((err) => {
            console.error("[audio] play failed", err);
          });
        } else {
          audio.pause();
        }
        return;
      }

      const url = await ensureAudioUrl(messageId);
      if (!url) return;
      audio.src = url;
      setState({
        playingId: messageId,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      });
      await audio.play().catch((err) => {
        console.error("[audio] play failed", err);
      });
    },
    [ensureAudioUrl, state.playingId],
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
    playingId: state.playingId,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    progress,
    toggle,
    seekRatio,
    handlePlay,
    handlePause,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleDurationChange,
    handleEnded,
  };
};
