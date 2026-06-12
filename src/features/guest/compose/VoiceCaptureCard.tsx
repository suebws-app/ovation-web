"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { MicIcon } from "@ovation/icons/MicIcon";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { CaptureCardHeader } from "./CaptureCardHeader";
import { VoicePanel } from "./VoicePanel";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const tonalButtonClass =
  "bg-primary/15 text-primary hover:bg-primary/25 rounded-12 tablet:w-auto tablet:px-5 h-12 w-full gap-2";

type VoiceCaptureCardProps = {
  maxDurationSec?: number;
};

export const VoiceCaptureCard = ({
  maxDurationSec,
}: VoiceCaptureCardProps = {}) => {
  const t = useTranslations();
  const audio = useGuestSubmissionStore((s) => s.audio);
  const setAudio = useGuestSubmissionStore((s) => s.setAudio);
  const [editing, setEditing] = useState(false);

  const open = editing && !audio;
  const showInlineCta = !audio && !editing;

  return (
    <div className="bg-card/70 rounded-16 tablet:p-5 p-4">
      <div className="tablet:flex-row tablet:items-center flex flex-col gap-4">
        <CaptureCardHeader
          icon={<MicIcon width={20} height={20} />}
          iconClassName="bg-primary/15 text-primary"
          title={t("guest__compose__voice_title")}
          meta={
            audio
              ? t("guest__compose__voice_captured", {
                  duration: formatTime(audio.durationSec),
                })
              : t("guest__compose__voice_subtitle", {
                  seconds: maxDurationSec ?? 60,
                })
          }
        />
        {showInlineCta && (
          <Button
            type="button"
            variant="ghost"
            className={tonalButtonClass}
            onClick={() => setEditing(true)}
          >
            <MicIcon width={16} height={16} />
            {t("guest__compose__add_voice")}
          </Button>
        )}
      </div>

      {audio && !open && (
        <div className="mt-4 flex flex-col gap-3">
          <audio src={audio.url} controls className="w-full" />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setAudio(null);
                setEditing(true);
              }}
            >
              {t("guest__record__audio__re_record")}
            </Button>
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => setAudio(null)}
            >
              {t("guest__compose__remove")}
            </Button>
          </div>
        </div>
      )}

      {open && (
        <div className="mt-4">
          <VoicePanel
            onCaptured={() => setEditing(false)}
            maxDurationSec={maxDurationSec}
          />
        </div>
      )}
    </div>
  );
};
