"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { CaptureCardHeader } from "./CaptureCardHeader";
import { VideoRecorderModal } from "./VideoRecorderModal";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const tonalButtonClass =
  "bg-destructive/15 text-destructive hover:bg-destructive/25 rounded-12 tablet:w-auto tablet:px-5 h-12 w-full gap-2";

type VideoCaptureCardProps = {
  maxDurationSec?: number;
};

export const VideoCaptureCard = ({
  maxDurationSec,
}: VideoCaptureCardProps = {}) => {
  const t = useTranslations();
  const video = useGuestSubmissionStore((s) => s.video);
  const setVideo = useGuestSubmissionStore((s) => s.setVideo);
  const [recorderOpen, setRecorderOpen] = useState(false);

  const openRecorder = () => {
    setVideo(null);
    setRecorderOpen(true);
  };

  return (
    <div className="bg-card/70 rounded-16 tablet:p-5 p-4">
      <div className="tablet:flex-row tablet:items-center flex flex-col gap-4">
        <CaptureCardHeader
          icon={<VideoIcon width={20} height={20} />}
          iconClassName="bg-destructive/15 text-destructive"
          title={t("guest__compose__video_title")}
          meta={
            video
              ? t("guest__compose__video_captured", {
                  duration: formatTime(video.durationSec),
                })
              : t("guest__compose__video_subtitle", {
                  seconds: maxDurationSec ?? 60,
                })
          }
        />
        {!video && (
          <Button
            type="button"
            variant="ghost"
            className={tonalButtonClass}
            onClick={() => setRecorderOpen(true)}
          >
            <VideoIcon width={16} height={16} />
            {t("guest__compose__add_video")}
          </Button>
        )}
      </div>

      {video && (
        <div className="mt-4 flex flex-col gap-3">
          <video
            src={video.url}
            controls
            playsInline
            className="rounded-12 aspect-video w-full bg-black"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={openRecorder}
            >
              {t("guest__record__video__re_record")}
            </Button>
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => setVideo(null)}
            >
              {t("guest__compose__remove")}
            </Button>
          </div>
        </div>
      )}

      <VideoRecorderModal
        open={recorderOpen}
        onClose={() => setRecorderOpen(false)}
        maxDurationSec={maxDurationSec}
      />
    </div>
  );
};
