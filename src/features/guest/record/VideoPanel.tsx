"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Pause } from "@ovation/icons/Pause";
import type { useVideoRecorder } from "./useVideoRecorder";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

type VideoPanelProps = {
  recorder: ReturnType<typeof useVideoRecorder>;
};

export const VideoPanel = ({ recorder }: VideoPanelProps) => {
  const t = useTranslations();
  const {
    state,
    recording,
    elapsed,
    error,
    maxDurationSec,
    start,
    stop,
    reset,
    attachPreview,
  } = recorder;
  const previewRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    attachPreview(previewRef.current);
    return () => attachPreview(null);
  }, [attachPreview]);

  if (recording) {
    return (
      <div className="rounded-16 bg-card border-border space-y-4 border p-6">
        <video
          src={recording.url}
          controls
          playsInline
          className="rounded-12 w-full bg-black"
        />
        <p className="type-caption text-muted-foreground">
          {t("guest__record__audio__recorded", {
            duration: formatTime(recording.durationSec),
          })}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" className="rounded-full" onClick={reset}>
            {t("guest__record__video__re_record")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-16 bg-card border-border flex flex-col items-center gap-4 border p-6">
      <video
        ref={previewRef}
        playsInline
        muted
        className="rounded-12 aspect-video w-full bg-black"
      />

      {state === "recording" ? (
        <>
          <div className="type-h1 font-serif font-semibold tabular-nums">
            {formatTime(elapsed)}
            <span className="type-body-small text-muted-foreground ml-2">
              / {formatTime(maxDurationSec)}
            </span>
          </div>
          <Button type="button" onClick={stop} className="rounded-full">
            <Pause width={14} height={14} />
            {t("guest__record__video__stop")}
          </Button>
        </>
      ) : (
        <Button
          type="button"
          onClick={start}
          disabled={state === "requesting"}
          className="rounded-full"
        >
          {state === "requesting"
            ? t("guest__record__video__requesting")
            : t("guest__record__video__start")}
        </Button>
      )}

      <p className="type-caption text-muted-foreground text-center">
        {t("guest__record__video__caption", { seconds: maxDurationSec })}
      </p>

      {error && (
        <p className="type-body-small text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
