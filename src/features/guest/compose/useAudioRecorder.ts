"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { getBlobDuration } from "@/lib/media/getBlobDuration";

const DEFAULT_MAX_DURATION_SEC = 60;
const LEVEL_BAR_COUNT = 32;
const IDLE_LEVELS: number[] = Array.from({ length: LEVEL_BAR_COUNT }, () => 0);

export type AudioRecording = {
  blob: Blob;
  url: string;
  durationSec: number;
  mimeType: string;
};

type RecorderState = "idle" | "requesting" | "recording" | "paused" | "denied";

const pickMimeType = (): string => {
  if (typeof MediaRecorder === "undefined") return "audio/webm";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg",
  ];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c;
  }
  return "audio/webm";
};

export const useAudioRecorder = (maxDurationSec = DEFAULT_MAX_DURATION_SEC) => {
  const t = useTranslations();
  const [state, setState] = useState<RecorderState>("idle");
  const [recording, setRecording] = useState<AudioRecording | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [levels, setLevels] = useState<number[]>(IDLE_LEVELS);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number>(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const frameRef = useRef<number | null>(null);
  const maxDurationRef = useRef(maxDurationSec);
  useEffect(() => {
    maxDurationRef.current = maxDurationSec;
  });

  const stopMeter = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    void audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    setLevels(IDLE_LEVELS);
  }, []);

  const startMeter = useCallback((stream: MediaStream) => {
    const AudioContextCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextCtor) return;

    const context = new AudioContextCtor();
    audioContextRef.current = context;
    const analyser = context.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.6;
    context.createMediaStreamSource(stream).connect(analyser);

    const buffer = new Uint8Array(analyser.fftSize);
    let lastSampleAt = 0;

    const sample = (now: number) => {
      frameRef.current = requestAnimationFrame(sample);
      if (now - lastSampleAt < 60) return;
      lastSampleAt = now;

      analyser.getByteTimeDomainData(buffer);
      let sumSquares = 0;
      for (const value of buffer) {
        const centred = (value - 128) / 128;
        sumSquares += centred * centred;
      }
      const rms = Math.sqrt(sumSquares / buffer.length);
      const level = Math.min(1, Math.max(0.06, rms * 3.2));
      setLevels((prev) => [...prev.slice(1), level]);
    };

    frameRef.current = requestAnimationFrame(sample);
  }, []);

  const stopTracks = useCallback(() => {
    stopMeter();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, [stopMeter]);

  useEffect(() => {
    return () => {
      stopTracks();
    };
  }, [stopTracks]);

  const start = useCallback(async () => {
    setError(null);
    if (typeof window !== "undefined" && window.isSecureContext === false) {
      setError(t("guest__record__audio__error_insecure"));
      setState("denied");
      return;
    }
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setError(t("guest__record__audio__error_no_support"));
      return;
    }
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const wallClock = Math.round(
          (Date.now() - startedAtRef.current) / 1000,
        );
        const measured = await getBlobDuration(blob);
        const durationSec = Math.min(
          Math.round(measured > 0 ? measured : wallClock),
          maxDurationRef.current,
        );
        setRecording({ blob, url, durationSec, mimeType });
        setState("idle");
        stopTracks();
      };

      recorder.start(250);
      startedAtRef.current = Date.now();
      setElapsed(0);
      startMeter(stream);
      setState("recording");

      tickRef.current = setInterval(() => {
        const seconds = Math.floor((Date.now() - startedAtRef.current) / 1000);
        setElapsed(seconds);
        if (seconds >= maxDurationRef.current) {
          recorder.stop();
        }
      }, 200);
    } catch (e) {
      console.error("[useAudioRecorder] getUserMedia failed", e);
      setState("denied");
      const name = e instanceof Error ? e.name : "";
      const key =
        name === "NotAllowedError" || name === "SecurityError"
          ? "guest__record__audio__error_denied"
          : name === "NotFoundError" || name === "OverconstrainedError"
            ? "guest__record__audio__error_not_found"
            : name === "NotReadableError" || name === "TrackStartError"
              ? "guest__record__audio__error_in_use"
              : "guest__record__audio__error_other";
      setError(t(key));
    }
  }, [startMeter, stopTracks, t]);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const cancel = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder) {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      if (recorder.state === "recording") {
        try {
          recorder.stop();
        } catch {
          // ignore
        }
      }
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    stopTracks();
    setElapsed(0);
    setState("idle");
    setError(null);
  }, [stopTracks]);

  const reset = useCallback(() => {
    if (recording?.url) URL.revokeObjectURL(recording.url);
    setRecording(null);
    setElapsed(0);
    setError(null);
  }, [recording]);

  return {
    state,
    recording,
    elapsed,
    levels,
    error,
    maxDurationSec,
    start,
    stop,
    cancel,
    reset,
  };
};
