"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { CameraIcon } from "@ovation/icons/CameraIcon";
import { XIcon } from "@ovation/icons/XIcon";

type CameraCaptureModalProps = {
  open: boolean;
  onClose: () => void;
  onCaptured: (file: File) => void;
};

type ModalState = "requesting" | "ready" | "denied";

export const CameraCaptureModal = ({
  open,
  onClose,
  onCaptured,
}: CameraCaptureModalProps) => {
  const t = useTranslations();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<ModalState>("requesting");
  const [error, setError] = useState<string | null>(null);
  const [snapping, setSnapping] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const tRef = useRef(t);
  tRef.current = t;
  const stopStreamRef = useRef(stopStream);
  stopStreamRef.current = stopStream;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setState("requesting");
    setError(null);

    const start = async () => {
      const tr = tRef.current;
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setError(tr("guest__record__photo__error_no_support"));
        setState("denied");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;
          videoRef.current.play().catch(() => undefined);
        }
        setState("ready");
      } catch (e) {
        console.error("[CameraCaptureModal] getUserMedia failed", e);
        const name = e instanceof Error ? e.name : "";
        const key =
          name === "NotAllowedError" || name === "SecurityError"
            ? "guest__record__photo__error_denied"
            : name === "NotFoundError" || name === "OverconstrainedError"
              ? "guest__record__photo__error_no_camera"
              : "guest__record__photo__error_no_support";
        setError(tRef.current(key));
        setState("denied");
      }
    };

    start();

    return () => {
      cancelled = true;
      stopStreamRef.current();
    };
  }, [open]);

  const handleSnap = useCallback(async () => {
    const video = videoRef.current;
    if (!video || state !== "ready" || snapping) return;
    setSnapping(true);
    try {
      const width = video.videoWidth;
      const height = video.videoHeight;
      if (!width || !height) return;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, width, height);
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9),
      );
      if (!blob) return;
      const file = new File([blob], `photo-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      onCaptured(file);
      stopStream();
      onClose();
    } finally {
      setSnapping(false);
    }
  }, [onCaptured, onClose, snapping, state, stopStream]);

  const handleClose = useCallback(() => {
    stopStream();
    onClose();
  }, [onClose, stopStream]);

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex h-dvh w-dvw flex-col overscroll-contain bg-black"
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

      <div className="flex flex-1 items-center justify-center overflow-hidden">
        {state === "denied" ? (
          <p className="type-body-small max-w-sm px-6 text-center text-white/85">
            {error}
          </p>
        ) : (
          <video
            ref={videoRef}
            className="size-full object-contain"
            playsInline
            muted
          />
        )}
      </div>

      <div
        className="flex items-center justify-center gap-3 px-6 pt-6 pb-10"
        style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
      >
        <Button
          type="button"
          size="lg"
          className="rounded-full px-8 shadow-lg"
          disabled={state !== "ready" || snapping}
          onClick={handleSnap}
        >
          <CameraIcon width={16} height={16} />
          {t("guest__compose__camera_snap")}
        </Button>
      </div>
    </div>,
    document.body,
  );
};
