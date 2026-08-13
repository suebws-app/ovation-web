"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import { UploadIcon } from "@ovation/icons/UploadIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { LazyVideoPlayer } from "@/components/LazyVideoPlayer";
import { videoMimeFromType } from "@/lib/utils/videoMime";
import { getBlobDuration } from "@/lib/media/getBlobDuration";
import {
  MAX_VIDEOS,
  useGuestSubmissionStore,
  type VideoCapture,
} from "../store/useGuestSubmissionStore";
import { CaptureCardHeader } from "./CaptureCardHeader";
import { VideoRecorderModal } from "./VideoRecorderModal";

const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const newVideoId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const tonalButtonClass =
  "bg-destructive/15 text-destructive hover:bg-destructive/25 rounded-12 tablet:w-auto tablet:px-5 h-12 w-full gap-2";

type VideoCaptureCardProps = {
  maxDurationSec?: number;
};

type VideoPreviewRowProps = {
  video: VideoCapture;
  onRemove: () => void;
  removeLabel: string;
};

const VideoPreviewRow = ({
  video,
  onRemove,
  removeLabel,
}: VideoPreviewRowProps) => (
  <div
    className="rounded-12 bg-muted relative aspect-video w-full min-w-0 overflow-hidden"
    style={{ contain: "layout size paint" }}
  >
    <div className="absolute inset-0">
      <LazyVideoPlayer
        key={video.url}
        src={video.url}
        type={videoMimeFromType(video.mimeType)}
        load="eager"
        preload="metadata"
        className="size-full"
      />
    </div>
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 z-10 size-8 rounded-full bg-black/70 text-white shadow-lg ring-1 ring-white/30 backdrop-blur-sm hover:bg-black/85 hover:text-white"
      onClick={onRemove}
      aria-label={removeLabel}
    >
      <XIcon width={14} height={14} />
    </Button>
  </div>
);

export const VideoCaptureCard = ({
  maxDurationSec,
}: VideoCaptureCardProps = {}) => {
  const t = useTranslations();
  const videos = useGuestSubmissionStore((s) => s.videos);
  const addVideo = useGuestSubmissionStore((s) => s.addVideo);
  const removeVideo = useGuestSubmissionStore((s) => s.removeVideo);
  const [recorderOpen, setRecorderOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const count = videos.length;
  const atLimit = count >= MAX_VIDEOS;

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (atLimit) {
      setError(t("guest__compose__photo_max_reached", { max: MAX_VIDEOS }));
      return;
    }
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
      addVideo({
        id: newVideoId(),
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

  const totalDuration = videos.reduce((sum, v) => sum + v.durationSec, 0);
  const showInlineCta = count === 0;

  return (
    <div className="bg-card/70 rounded-16 tablet:p-5 p-4">
      <div className="tablet:flex-row tablet:items-center flex flex-col gap-4">
        <CaptureCardHeader
          icon={<VideoIcon width={20} height={20} />}
          iconClassName="bg-destructive/15 text-destructive"
          title={t("guest__compose__video_title")}
          meta={
            count > 0
              ? t("guest__compose__video_captured", {
                  duration: formatTime(totalDuration),
                })
              : t("guest__compose__video_subtitle", {
                  seconds: maxDurationSec ?? 60,
                })
          }
        />
        {showInlineCta && (
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
      {count > 0 && (
        <div className="mt-4 flex min-w-0 flex-col gap-3">
          {videos.map((video) => (
            <VideoPreviewRow
              key={video.id}
              video={video}
              onRemove={() => removeVideo(video.id)}
              removeLabel={t("guest__compose__remove")}
            />
          ))}

          {!atLimit && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setRecorderOpen(true)}
                disabled={uploading}
              >
                <VideoIcon width={14} height={14} />
                {t("guest__compose__add_video")}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => uploadInputRef.current?.click()}
                disabled={uploading}
              >
                <UploadIcon width={14} height={14} />
                {t("guest__compose__upload_video")}
              </Button>
            </div>
          )}
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
