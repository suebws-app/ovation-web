"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Waveform } from "@ovation/ui/components/Waveform";
import { RecordButton } from "./RecordButton";
import { useAudioRecorder } from "./useAudioRecorder";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

type VoicePanelProps = {
  onCaptured: () => void;
  maxDurationSec?: number;
  autoFocus?: boolean;
};

export const VoicePanel = ({
  onCaptured,
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

  const isRecording = recorder.state === "recording";

  return (
    <div
      ref={cardRef}
      className="flex flex-col items-center gap-4.5 text-center"
    >
      <p className="type-body-small text-muted-foreground max-w-sm">
        {t("guest__record__audio__hint", {
          seconds: recorder.maxDurationSec,
        })}
      </p>

      {isRecording && (
        <>
          <div className="type-h1 font-semibold tabular-nums">
            {formatTime(recorder.elapsed)}
            <span className="type-body-small text-muted-foreground ml-2">
              / {formatTime(recorder.maxDurationSec)}
            </span>
          </div>
          <Waveform
            bars={recorder.levels}
            height={40}
            progress={1}
            className="h-10 w-full"
          />
        </>
      )}

      <RecordButton
        isRecording={isRecording}
        isRequesting={recorder.state === "requesting"}
        label={
          isRecording
            ? t("guest__record__audio__stop")
            : t("guest__record__audio__start")
        }
        onClick={isRecording ? recorder.stop : recorder.start}
      />

      <p className="type-body-small text-muted-foreground">
        {recorder.state === "requesting"
          ? t("guest__record__audio__requesting")
          : isRecording
            ? t("guest__record__audio__stop")
            : t("guest__record__audio__start")}
      </p>

      {recorder.error && (
        <p className="type-body-small text-destructive" role="alert">
          {recorder.error}
        </p>
      )}
    </div>
  );
};
