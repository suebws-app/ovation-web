"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { StopIcon } from "@ovation/icons/StopIcon";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { useVideoRecorder } from "./useVideoRecorder";
import {
  useGuestSubmissionStore,
  type VideoCapture,
} from "../store/useGuestSubmissionStore";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

type VideoRecorderModalProps = {
  open: boolean;
  onClose: () => void;
  maxDurationSec?: number;
};

export const VideoRecorderModal = ({
  open,
  onClose,
  maxDurationSec,
}: VideoRecorderModalProps) => {
  const t = useTranslations();
  const recorder = useVideoRecorder(maxDurationSec);
  const { recording } = recorder;
  const setVideo = useGuestSubmissionStore((s) => s.setVideo);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef(recorder);
  useEffect(() => {
    recorderRef.current = recorder;
  });

  useEffect(() => {
    if (!open) return;
    const r = recorderRef.current;
    r.attachPreview(previewRef.current);
    r.prepare();
    return () => {
      const cleanup = recorderRef.current;
      cleanup.attachPreview(null);
      cleanup.cancel();
    };
  }, [open]);

  useEffect(() => {
    if (!recording) return;
    const capture: VideoCapture = {
      blob: recording.blob,
      url: recording.url,
      durationSec: recording.durationSec,
      mimeType: recording.mimeType,
    };
    setVideo(capture);
    recorderRef.current.reset();
    onClose();
  }, [recording, setVideo, onClose]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [open]);

  const handleClose = useCallback(() => {
    recorderRef.current.cancel();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  if (!open || typeof document === "undefined") return null;

  const isRecording = recorder.state === "recording";
  const isRequesting = recorder.state === "requesting";
  const canRecord = recorder.state === "preview";

  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-[100] flex h-dvh w-dvw flex-col overscroll-contain bg-black"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={handleClose}
        aria-label={t("guest__compose__camera_close")}
        className="absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25"
      >
        <XIcon width={20} height={20} />
      </button>

      {isRecording && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
          <span className="bg-destructive size-2.5 animate-pulse rounded-full" />
          <span className="type-body-small text-white tabular-nums">
            {formatTime(recorder.elapsed)}
            <span className="text-white/60">
              {" / "}
              {formatTime(recorder.maxDurationSec)}
            </span>
          </span>
        </div>
      )}

      <div className="flex flex-1 items-center justify-center overflow-hidden">
        {recorder.state === "denied" ? (
          <p className="type-body-small max-w-sm px-6 text-center text-white/85">
            {recorder.error ?? t("guest__record__video__error_other")}
          </p>
        ) : (
          <video
            ref={previewRef}
            playsInline
            muted
            className="size-full object-contain"
          />
        )}
      </div>

      <div
        className="flex items-center justify-center gap-3 px-6 pt-6 pb-10"
        style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
      >
        {isRecording ? (
          <Button
            type="button"
            variant="destructive"
            onClick={recorder.stop}
            className="rounded-full px-8 shadow-lg"
          >
            <StopIcon width={16} height={16} />
            {t("guest__record__video__stop")}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={recorder.start}
            disabled={!canRecord}
            className="rounded-full px-8 shadow-lg"
          >
            <VideoIcon width={16} height={16} />
            {isRequesting
              ? t("guest__record__video__requesting")
              : t("guest__record__video__start")}
          </Button>
        )}
      </div>
    </div>,
    document.body,
  );
};
