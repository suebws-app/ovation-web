"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Card, CardContent } from "@ovation/ui/components/Card";
import { MicIcon } from "@ovation/icons/MicIcon";
import { StopIcon } from "@ovation/icons/StopIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { useAudioRecorder } from "./useAudioRecorder";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

type VoicePanelProps = {
  onCaptured: () => void;
  onCancel?: () => void;
  maxDurationSec?: number;
  autoFocus?: boolean;
};

export const VoicePanel = ({
  onCaptured,
  onCancel,
  maxDurationSec,
  autoFocus,
}: VoicePanelProps) => {
  const t = useTranslations();
  const recorder = useAudioRecorder(maxDurationSec);
  const setAudio = useGuestSubmissionStore((s) => s.setAudio);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [autoFocus]);

  useEffect(() => {
    if (recorder.recording) {
      setAudio({
        blob: recorder.recording.blob,
        url: recorder.recording.url,
        durationSec: recorder.recording.durationSec,
        mimeType: recorder.recording.mimeType,
      });
      onCaptured();
    }
  }, [recorder.recording, setAudio, onCaptured]);

  const handleCancel = () => {
    recorder.cancel();
    onCancel?.();
  };

  return (
    <Card ref={cardRef} className="relative pt-12">
      {onCancel && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 size-8 rounded-full"
          onClick={handleCancel}
          aria-label={t("common__cancel")}
        >
          <XIcon width={14} height={14} />
        </Button>
      )}
      <CardContent className="flex flex-col items-center gap-4.5 text-center">
        <p className="type-body-small text-muted-foreground max-w-sm">
          {t("guest__record__audio__hint", {
            seconds: recorder.maxDurationSec,
          })}
        </p>

        {recorder.state === "recording" ? (
          <>
            <div className="type-h1 font-semibold tabular-nums">
              {formatTime(recorder.elapsed)}
              <span className="type-body-small text-muted-foreground ml-2">
                / {formatTime(recorder.maxDurationSec)}
              </span>
            </div>
            <Button
              type="button"
              onClick={recorder.stop}
              className="rounded-full"
            >
              <StopIcon width={16} height={16} />
              {t("guest__record__audio__stop")}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={recorder.start}
            disabled={recorder.state === "requesting"}
            className="rounded-full"
          >
            {recorder.state === "requesting" ? (
              t("guest__record__audio__requesting")
            ) : (
              <>
                <MicIcon width={16} height={16} />
                {t("guest__record__audio__start")}
              </>
            )}
          </Button>
        )}

        {recorder.error && (
          <p className="type-body-small text-destructive" role="alert">
            {recorder.error}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
