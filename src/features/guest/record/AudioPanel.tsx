"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Mic } from "@ovation/icons/Mic";
import { Pause } from "@ovation/icons/Pause";
import { Play } from "@ovation/icons/Play";
import type { useAudioRecorder } from "./useAudioRecorder";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

type AudioPanelProps = {
  recorder: ReturnType<typeof useAudioRecorder>;
};

export const AudioPanel = ({ recorder }: AudioPanelProps) => {
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
  } = recorder;

  if (recording) {
    return (
      <div className="rounded-16 bg-card border-border space-y-4 border p-6">
        <p className="type-body-small text-muted-foreground">
          {t("guest__record__audio__recorded", {
            duration: formatTime(recording.durationSec),
          })}
        </p>
        <audio
          src={recording.url}
          controls
          className="w-full"
          aria-label={t("guest__record__audio__recorded", {
            duration: formatTime(recording.durationSec),
          })}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" className="rounded-full" onClick={reset}>
            {t("guest__record__audio__re_record")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-16 bg-card border-border flex flex-col items-center gap-5 border p-8 text-center">
      <p className="type-body-small text-muted-foreground max-w-sm">
        {t("guest__record__audio__hint", {
          minutes: Math.round(maxDurationSec / 60),
        })}
      </p>

      {state === "recording" ? (
        <>
          <div className="type-h1 font-serif font-semibold tabular-nums">
            {formatTime(elapsed)}
          </div>
          <Button
            type="button"
            onClick={stop}
            size="lg"
            className="rounded-full"
          >
            <Pause width={16} height={16} />
            {t("guest__record__audio__stop")}
          </Button>
        </>
      ) : (
        <Button
          type="button"
          onClick={start}
          size="lg"
          disabled={state === "requesting"}
          className="rounded-full"
        >
          {state === "requesting" ? (
            t("guest__record__audio__requesting")
          ) : (
            <>
              <Mic width={16} height={16} />
              {t("guest__record__audio__start")}
            </>
          )}
        </Button>
      )}

      {error && (
        <p className="type-body-small text-destructive" role="alert">
          {error}
        </p>
      )}

      {!error && state === "idle" && (
        <p className="type-caption text-muted-foreground flex items-center gap-1.5">
          <Play width={11} height={11} />
          {t("guest__record__audio__permission_hint")}
        </p>
      )}
    </div>
  );
};
