"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import { UploadIcon } from "@ovation/icons/UploadIcon";
import { LazyVideoPlayer } from "@/components/LazyVideoPlayer";
import { videoMimeFromType } from "@/lib/utils/videoMime";
import { getBlobDuration } from "@/lib/media/getBlobDuration";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { CaptureCardHeader } from "./CaptureCardHeader";
import { VideoRecorderModal } from "./VideoRecorderModal";

const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

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
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const openRecorder = () => {
    setVideo(null);
    setRecorderOpen(true);
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("video/")) {
      setError(t("guest__record__video__error_not_video"));
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setError(t("guest__record__video__error_too_large"));
      return;
    }
    setUploading(true);
    try {
      const measured = await getBlobDuration(file);
      const limit = maxDurationSec ?? 60;
      const durationSec = Math.min(Math.round(measured || 0), limit);
      const url = URL.createObjectURL(file);
      setVideo({
        blob: file,
        url,
        durationSec,
        mimeType: file.type,
      });
    } catch {
      setError(t("guest__record__video__error_other"));
    } finally {
      setUploading(false);
    }
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
          <div className="tablet:w-auto flex w-full gap-2">
            <Button
              type="button"
              variant="ghost"
              className={`${tonalButtonClass} flex-1`}
              onClick={() => setRecorderOpen(true)}
              disabled={uploading}
            >
              <VideoIcon width={16} height={16} />
              {t("guest__compose__add_video")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={`${tonalButtonClass} flex-1`}
              onClick={() => uploadInputRef.current?.click()}
              disabled={uploading}
            >
              <UploadIcon width={16} height={16} />
              {t("guest__compose__upload_video")}
            </Button>
          </div>
        )}
      </div>

      {video && (
        <div className="mt-4 flex flex-col gap-3">
          <LazyVideoPlayer
            key={video.url}
            src={video.url}
            type={videoMimeFromType(video.mimeType)}
            load="eager"
            preload="metadata"
            className="rounded-12 aspect-video w-full"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={openRecorder}>
              {t("guest__record__video__re_record")}
            </Button>
            <Button variant="ghost" onClick={() => setVideo(null)}>
              {t("guest__compose__remove")}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="type-body-small text-destructive mt-2.5" role="alert">
          {error}
        </p>
      )}

      <input
        ref={uploadInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          handleUpload(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <VideoRecorderModal
        open={recorderOpen}
        onClose={() => setRecorderOpen(false)}
        maxDurationSec={maxDurationSec}
      />
    </div>
  );
};
