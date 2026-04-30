"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Mic } from "@ovation/icons/Mic";
import { Video } from "@ovation/icons/Video";
import { MessageSquare } from "@ovation/icons/MessageSquare";
import { Camera } from "@ovation/icons/Camera";
import { ApiError } from "@/lib/api/client";
import { publicClient, type UploadMediaItem } from "@/lib/api/public-client";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import { WizardHeader } from "../shell/WizardHeader";
import { StickyCTA } from "../shell/StickyCTA";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { ReviewItem } from "./ReviewItem";

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
};

export const ReviewClient = ({ slug }: ReviewClientProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionSource = readSubmissionSource(searchParams.get("source"));

  const guestName = useGuestSubmissionStore((s) => s.guestName);
  const setGuestName = useGuestSubmissionStore((s) => s.setGuestName);
  const audio = useGuestSubmissionStore((s) => s.audio);
  const video = useGuestSubmissionStore((s) => s.video);
  const note = useGuestSubmissionStore((s) => s.note);
  const photo = useGuestSubmissionStore((s) => s.photo);
  const reset = useGuestSubmissionStore((s) => s.reset);

  const [submitting, setSubmitting] = useState(false);
  const [progressLabel, setProgressLabel] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [idempotencyKey] = useState(newIdempotencyKey);
  const [pageLoadedAt] = useState(() => Date.now());
  const [submitted, setSubmitted] = useState(false);

  const hasNote = note.trim().length > 0;
  const hasAnyContent = Boolean(audio || video || photo) || hasNote;
  const canSubmit = guestName.trim().length > 0 && hasAnyContent && !submitting;

  useEffect(() => {
    if (!hasAnyContent && !submitting && !submitted) {
      router.replace(`/g/${slug}/compose`);
    }
  }, [hasAnyContent, submitting, submitted, router, slug]);

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      let audioKey: string | null = null;
      const mediaIds: string[] = [];

      const needUpload = audio || video || photo;
      if (needUpload) {
        setProgressLabel(t("guest__record__progress_preparing"));
        const mediaRequest: UploadMediaItem[] = [];
        if (video) mediaRequest.push({ type: "video", contentType: video.mimeType });
        if (photo) mediaRequest.push({ type: "photo", contentType: photo.file.type });

        const uploadResult = await publicClient.uploadUrls(slug, {
          audioContentType: audio?.mimeType ?? null,
          media: mediaRequest.length > 0 ? mediaRequest : undefined,
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
          const target = uploadResult.mediaTargets.find((m) => m.type === "video");
          if (!target)
            throw new Error(t("guest__record__error_no_video_target"));
          setProgressLabel(t("guest__record__progress_video"));
          await uploadToTarget(target, video.blob);
          mediaIds.push(target.mediaId);
        }
        if (photo) {
          const target = uploadResult.mediaTargets.find((m) => m.type === "photo");
          if (!target)
            throw new Error(t("guest__record__error_no_photo_target"));
          setProgressLabel(t("guest__record__progress_photo"));
          await uploadToTarget(target, photo.file);
          mediaIds.push(target.mediaId);
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
        _t: pageLoadedAt,
      });

      setSubmitted(true);
      reset();
      const successHref =
        submissionSource === "kiosk"
          ? `/kiosk/${slug}?submitted=1`
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

  return (
    <div className="flex flex-1 flex-col">
      <div className="tablet:px-8 small-desktop:px-10 small-desktop:py-9 flex flex-1 flex-col gap-6 px-5 pt-5 pb-9">
        <WizardHeader
          backHref={`/g/${slug}/photo`}
          step={3}
          totalSteps={3}
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
              icon={<Mic width={18} height={18} />}
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
              icon={<Video width={18} height={18} />}
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
              icon={<MessageSquare width={18} height={18} />}
              iconClassName="bg-secondary"
              title={t("guest__compose__note_title")}
              preview={
                <p className="bg-background/60 type-body rounded-12 p-3.5 font-serif leading-relaxed italic">
                  {note}
                </p>
              }
            />
          )}
          {photo && (
            <ReviewItem
              icon={<Camera width={18} height={18} />}
              iconClassName="bg-accent"
              title={t("guest__photo__title")}
              preview={
                <img
                  src={photo.url}
                  alt=""
                  className="rounded-12 max-h-100 w-full object-contain"
                />
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
          disabled={!canSubmit}
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
