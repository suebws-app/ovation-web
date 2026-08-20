"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { MicIcon } from "@ovation/icons/MicIcon";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const RecordedVoiceRow = () => {
  const t = useTranslations();
  const audio = useGuestSubmissionStore((s) => s.audio);
  const setAudio = useGuestSubmissionStore((s) => s.setAudio);

  if (!audio) return null;

  return (
    <div className="bg-card/70 rounded-16 flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="type-body-small text-foreground flex items-center gap-2 font-medium">
          <span className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-full">
            <MicIcon width={16} height={16} aria-hidden />
          </span>
          {t("guest__compose__voice_captured", {
            duration: formatTime(audio.durationSec),
          })}
        </span>
        <Button variant="ghost" size="sm" onClick={() => setAudio(null)}>
          {t("guest__compose__remove")}
        </Button>
      </div>
      <audio src={audio.url} controls className="w-full" />
    </div>
  );
};
