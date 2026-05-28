"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { MicIcon } from "@ovation/icons/MicIcon";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import { MessageSquareIcon } from "@ovation/icons/MessageSquareIcon";
import { CameraIcon } from "@ovation/icons/CameraIcon";
import { ApiError } from "@/lib/api/client";
import { publicClient, type UploadMediaItem } from "@/lib/api/public-client";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import { WizardHeader } from "../shell/WizardHeader";
import { StickyCTA } from "../shell/StickyCTA";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { KioskFullscreenGuard } from "@/features/kiosk-setup/components/KioskFullscreenGuard";
import { ReviewItem } from "./ReviewItem";
import { ReviewPhotoTile } from "./ReviewPhotoTile";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const newIdempotencyKey = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const readSubmissionSource = (
  raw: string | null,
): "kiosk" | "qr_scan" | "direct_link" => {
  if (raw === "kiosk") return "kiosk";
  if (raw === "qr_scan") return "qr_scan";
  return "direct_link";
};

type ReviewClientProps = {
  slug: string;
  exitPin: string | null;
  fullscreenLock: boolean;
  sourceParam: string | null;
};

export const ReviewClient = ({
  slug,
  exitPin,
  fullscreenLock,
  sourceParam,
}: ReviewClientProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const submissionSource = readSubmissionSource(sourceParam);

  const guestName = useGuestSubmissionStore((s) => s.guestName);
  const setGuestName = useGuestSubmissionStore((s) => s.setGuestName);
  const audio = useGuestSubmissionStore((s) => s.audio);
  const video = useGuestSubmissionStore((s) => s.video);
  const note = useGuestSubmissionStore((s) => s.note);
  const photos = useGuestSubmissionStore((s) => s.photos);
  const reset = useGuestSubmissionStore((s) => s.reset);

  const sessionStartAt = useGuestSubmissionStore((s) => s.sessionStartAt);
  const [submitting, setSubmitting] = useState(false);
  const [progressLabel, setProgressLabel] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [idempotencyKey] = useState(newIdempotencyKey);
  const [submitted, setSubmitted] = useState(false);

  const hasNote = note.trim().length > 0;
  const hasPhotos = photos.length > 0;
  const hasAnyContent = Boolean(audio || video) || hasPhotos || hasNote;

  const handleSubmit = async () => {
    setSubmitError(null);
    if (guestName.trim().length === 0) {
      setSubmitError(t("guest__review__error_missing_name"));
      return;
    }
    if (!hasAnyContent) {
      setSubmitError(t("guest__review__error_missing_content"));
      return;
    }
    setSubmitting(true);
    try {
      let audioKey: string | null = null;
      const mediaIds: string[] = [];

      const needUpload = audio || video || hasPhotos;
      if (needUpload) {
        setProgressLabel(t("guest__record__progress_preparing"));
        const mediaRequest: UploadMediaItem[] = [];
        if (video)
          mediaRequest.push({ type: "video", contentType: video.mimeType });
        photos.forEach((p) =>
          mediaRequest.push({ type: "photo", contentType: p.file.type }),
        );

        const uploadResult = await publicClient.uploadUrls(slug, {
          audioContentType: audio?.mimeType ?? null,
          media: mediaRequest.length > 0 ? mediaRequest : undefined,
          source: submissionSource,
        });

        if (audio) {
          const target = uploadResult.audioTargets[0];
          if (!target)
            throw new Error(t("guest__record__error_no_audio_target"));
          setProgressLabel(t("guest__record__progress_audio"));
          await uploadToTarget(target, audio.blob);
          audioKey = target.key;
        }
        if (video) {
          const target = uploadResult.mediaTargets.find(
            (m) => m.type === "video",
          );
          if (!target)
            throw new Error(t("guest__record__error_no_video_target"));
          setProgressLabel(t("guest__record__progress_video"));
          await uploadToTarget(target, video.blob);
          mediaIds.push(target.mediaId);
        }
        if (hasPhotos) {
          const photoTargets = uploadResult.mediaTargets.filter(
            (m) => m.type === "photo",
          );
          if (photoTargets.length < photos.length)
            throw new Error(t("guest__record__error_no_photo_target"));
          for (let i = 0; i < photos.length; i++) {
            setProgressLabel(t("guest__record__progress_photo"));
            await uploadToTarget(photoTargets[i], photos[i].file);
            mediaIds.push(photoTargets[i].mediaId);
          }
        }
      }

      setProgressLabel(t("guest__record__progress_sending"));
      await publicClient.createMessage(slug, idempotencyKey, {
        guestNames: guestName.trim(),
        audioKey,
        audioDurationSec: audio?.durationSec ?? null,
        audioMimeType: audio?.mimeType ?? null,
        mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
        writtenNote: hasNote ? note.trim() : null,
        submissionSource,
        submissionLanguage: locale,
        clientCreatedAt: new Date().toISOString(),
        _honeypot: "",
        _t: sessionStartAt ?? Date.now() - 5000,
      });

      setSubmitted(true);
      reset();
      const successHref =
        submissionSource === "kiosk"
          ? `/${locale}/kiosk/${slug}?submitted=1`
          : `/g/${slug}/thank-you`;
      router.replace(successHref);
    } catch (error) {
      setSubmitError(
        ApiError.isApiError(error)
          ? error.message
          : error instanceof Error
            ? error.message
            : t("guest__record__error_default"),
      );
    } finally {
      setSubmitting(false);
      setProgressLabel(null);
    }
  };

  const isKioskSession = submissionSource === "kiosk";
  const sourceQuery = isKioskSession ? "?source=kiosk" : "";
  const backHref = `/g/${slug}/compose${sourceQuery}`;

  return (
    <div className="flex flex-1 flex-col">
      <KioskFullscreenGuard
        active={isKioskSession && fullscreenLock}
        exitPin={exitPin}
        exitHref="/kiosk"
      />
      <div className="tablet:px-8 small-desktop:px-10 small-desktop:py-9 flex flex-1 flex-col gap-6 px-5 pt-5 pb-9">
        <WizardHeader
          backHref={backHref}
          step={2}
          totalSteps={2}
          title={t("guest__review__title")}
          subtitle={t("guest__review__subtitle")}
        />

        <div className="bg-card border-border rounded-16 border p-5">
          <Label htmlFor="guest-name" className="mb-2">
            {t("guest__record__name_label")}
          </Label>
          <Input
            id="guest-name"
            type="text"
            autoComplete="name"
            placeholder={t("guest__record__name_placeholder")}
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          {audio && (
            <ReviewItem
              icon={<MicIcon width={18} height={18} />}
              iconClassName="bg-primary"
              title={t("guest__compose__voice_title")}
              meta={t("guest__compose__voice_captured", {
                duration: formatTime(audio.durationSec),
              })}
              preview={<audio src={audio.url} controls className="w-full" />}
            />
          )}
          {video && (
            <ReviewItem
              icon={<VideoIcon width={18} height={18} />}
              iconClassName="bg-destructive"
              title={t("guest__compose__video_title")}
              meta={t("guest__compose__video_captured", {
                duration: formatTime(video.durationSec),
              })}
              preview={
                <video
                  src={video.url}
                  controls
                  playsInline
                  className="rounded-12 aspect-video w-full bg-black"
                />
              }
            />
          )}
          {hasNote && (
            <ReviewItem
              icon={<MessageSquareIcon width={18} height={18} />}
              iconClassName="bg-secondary"
              title={t("guest__compose__note_title")}
              preview={
                <p className="bg-background/60 type-body rounded-12 p-3.5 font-serif leading-relaxed italic">
                  {note}
                </p>
              }
            />
          )}
          {hasPhotos && (
            <ReviewItem
              icon={<CameraIcon width={18} height={18} />}
              iconClassName="bg-accent"
              title={t("guest__compose__photo_title")}
              meta={t("guest__compose__photo_count", {
                count: photos.length,
                max: 5,
              })}
              preview={
                <div className="grid grid-cols-3 gap-2 tablet:grid-cols-4">
                  {photos.map((p) => (
                    <ReviewPhotoTile key={p.id} url={p.url} />
                  ))}
                </div>
              }
            />
          )}
        </div>

        {submitError && (
          <p className="type-body-small text-destructive" role="alert">
            {submitError}
          </p>
        )}
      </div>
      <StickyCTA caption={t("guest__record__caption")}>
        <Button
          type="button"
          size="lg"
          className="w-full rounded-full shadow-lg"
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting
            ? (progressLabel ?? t("guest__record__sending"))
            : t("guest__record__send")}
        </Button>
      </StickyCTA>
    </div>
  );
};
