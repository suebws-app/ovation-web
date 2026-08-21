"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { VoicePanel } from "../compose/VoicePanel";
import { GuestActionSheet } from "./GuestActionSheet";

type VoiceRecordSheetProps = {
  open: boolean;
  maxDurationSec: number;
  onOpenChange: (open: boolean) => void;
};

export const VoiceRecordSheet = ({
  open,
  maxDurationSec,
  onOpenChange,
}: VoiceRecordSheetProps) => {
  const t = useTranslations();
  const audio = useGuestSubmissionStore((s) => s.audio);
  const setAudio = useGuestSubmissionStore((s) => s.setAudio);

  return (
    <GuestActionSheet
      open={open}
      title={t("guest__compose__voice_title")}
      onOpenChange={onOpenChange}
      bodyClassName="justify-center"
    >
      {audio ? (
        <div className="flex flex-col gap-3">
          <audio src={audio.url} controls className="w-full" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAudio(null)}>
              {t("guest__record__audio__re_record")}
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              {t("guest__upload__voice_done")}
            </Button>
          </div>
        </div>
      ) : (
        <VoicePanel
          onCaptured={() => onOpenChange(false)}
          maxDurationSec={maxDurationSec}
          autoFocus={open}
        />
      )}
    </GuestActionSheet>
  );
};
