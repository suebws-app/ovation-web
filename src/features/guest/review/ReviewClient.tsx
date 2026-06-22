"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { MicIcon } from "@ovation/icons/MicIcon";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import { MessageSquareIcon } from "@ovation/icons/MessageSquareIcon";
import { CameraIcon } from "@ovation/icons/CameraIcon";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { publicClient, type UploadMediaItem } from "@/lib/api/public-client";
import { uploadToTarget, UploadError } from "@/lib/media/uploadToTarget";
import { WizardHeader } from "../shell/WizardHeader";
import { StickyCTA } from "../shell/StickyCTA";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { ReviewItem } from "./ReviewItem";
import { ReviewPhotoTile } from "./ReviewPhotoTile";

type UploadTask = {
  id: string;
  pct: number;
  failed: boolean;
};

type SubmitPhase = "uploading" | "sending";

const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const stripMimeParams = (mime: string): string => mime.split(";")[0].trim();

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

type Translator = ReturnType<typeof useTranslations>;

const mapSubmitError = (error: unknown, t: Translator): string => {
  if (ApiError.isApiError(error)) {
    if (error.status === 413) return t("guest__record__error_too_large");
    if (error.status === 415)
      return t("guest__record__error_unsupported_format");
    if (error.status === 429) return t("guest__record__error_rate_limited");
    if (error.status === 400 || error.code === "VALIDATION_ERROR")
      return t("guest__record__error_validation");
    if (error.status >= 500) return t("guest__record__error_network_retry");
    return error.message || t("guest__record__error_default");
  }
  if (error instanceof UploadError) {
    if (error.status === 413) return t("guest__record__error_too_large");
    if (error.status === 415)
      return t("guest__record__error_unsupported_format");
    if (error.retryable) return t("guest__record__error_network_retry");
    return t("guest__record__error_default");
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return t("guest__record__error_default");
};

type ReviewClientProps = {
  slug: string;
  sourceParam: string | null;
};

export const ReviewClient = ({ slug, sourceParam }: ReviewClientProps) => {
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
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [phase, setPhase] = useState<SubmitPhase>("uploading");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [idempotencyKey] = useState(newIdempotencyKey);

  const hasFailedTask = tasks.some((t) => t.failed);
  const overallPct =
    tasks.length === 0
      ? 0
      : Math.round(
          tasks.reduce((acc, task) => acc + task.pct, 0) / tasks.length,
        );

  const hasNote = note.trim().length > 0;
  const hasPhotos = photos.length > 0;
  const hasAnyContent = Boolean(audio || video) || hasPhotos || hasNote;

  useEffect(() => {
    const thankYou =
      submissionSource === "kiosk"
        ? `/${locale}/kiosk/${slug}?submitted=1`
        : `/${locale}/g/${slug}/thank-you`;
    router.prefetch(thankYou);
  }, [router, slug, locale, submissionSource]);

  const updateTask = (id: string, patch: Partial<UploadTask>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...patch } : task)),
    );
  };

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

    const initialTasks: UploadTask[] = [];
    if (audio) initialTasks.push({ id: "audio", pct: 0, failed: false });
    if (video) initialTasks.push({ id: "video", pct: 0, failed: false });
    photos.forEach((_, i) =>
      initialTasks.push({ id: `photo-${i}`, pct: 0, failed: false }),
    );
    setTasks(initialTasks);
    setPhase("uploading");
    setSubmitting(true);

    try {
      let audioKey: string | null = null;
      const mediaIds: string[] = [];

      const needUpload = audio || video || hasPhotos;
      if (needUpload) {
        const mediaRequest: UploadMediaItem[] = [];
        if (video)
          mediaRequest.push({
            type: "video",
            contentType: stripMimeParams(video.mimeType),
          });
        photos.forEach((p) =>
          mediaRequest.push({ type: "photo", contentType: p.file.type }),
        );

        const uploadResult = await publicClient.uploadUrls(slug, {
          audioContentType: audio ? stripMimeParams(audio.mimeType) : null,
          media: mediaRequest.length > 0 ? mediaRequest : undefined,
          source: submissionSource,
          _honeypot: "",
          _t: sessionStartAt ?? Date.now() - 5000,
        });

        const uploadJobs: Array<Promise<void>> = [];

        if (audio) {
          const target = uploadResult.audioTargets[0];
          if (!target)
            throw new Error(t("guest__record__error_no_audio_target"));
          uploadJobs.push(
            uploadToTarget(target, audio.blob, {
              onProgress: (pct) => updateTask("audio", { pct }),
            })
              .then(() => {
                audioKey = target.key;
                updateTask("audio", { pct: 100 });
              })
              .catch((err) => {
                updateTask("audio", { failed: true });
                throw err;
              }),
          );
        }

        if (video) {
          const target = uploadResult.mediaTargets.find(
            (m) => m.type === "video",
          );
          if (!target)
            throw new Error(t("guest__record__error_no_video_target"));
          uploadJobs.push(
            uploadToTarget(target, video.blob, {
              onProgress: (pct) => updateTask("video", { pct }),
            })
              .then(() => {
                mediaIds.push(target.mediaId);
                updateTask("video", { pct: 100 });
              })
              .catch((err) => {
                updateTask("video", { failed: true });
                throw err;
              }),
          );
        }

        if (hasPhotos) {
          const photoTargets = uploadResult.mediaTargets.filter(
            (m) => m.type === "photo",
          );
          if (photoTargets.length < photos.length)
            throw new Error(t("guest__record__error_no_photo_target"));
          photos.forEach((photo, i) => {
            const taskId = `photo-${i}`;
            const target = photoTargets[i];
            uploadJobs.push(
              uploadToTarget(target, photo.file, {
                onProgress: (pct) => updateTask(taskId, { pct }),
              })
                .then(() => {
                  mediaIds.push(target.mediaId);
                  updateTask(taskId, { pct: 100 });
                })
                .catch((err) => {
                  updateTask(taskId, { failed: true });
                  throw err;
                }),
            );
          });
        }

        await Promise.all(uploadJobs);
      }

      setPhase("sending");

      await publicClient.createMessage(slug, idempotencyKey, {
        guestNames: guestName.trim(),
        audioKey,
        audioDurationSec: audio?.durationSec ?? null,
        audioMimeType: audio ? stripMimeParams(audio.mimeType) : null,
        mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
        writtenNote: hasNote ? note.trim() : null,
        submissionSource,
        submissionLanguage: locale,
        clientCreatedAt: new Date().toISOString(),
        _honeypot: "",
        _t: sessionStartAt ?? Date.now() - 5000,
      });

      reset();
      const successHref =
        submissionSource === "kiosk"
          ? `/${locale}/kiosk/${slug}?submitted=1`
          : `/g/${slug}/thank-you`;
      router.replace(successHref);
    } catch (error) {
      setSubmitError(mapSubmitError(error, t));
      setSubmitting(false);
    }
  };

  const isKioskSession = submissionSource === "kiosk";
  const sourceQuery = isKioskSession ? "?source=kiosk" : "";
  const backHref = `/g/${slug}/compose${sourceQuery}`;

  return (
    <div className="flex flex-1 flex-col">
      <div className="tablet:px-8 small-desktop:px-10 small-desktop:py-9 flex flex-1 flex-col gap-6 px-5 pt-5 pb-9">
        <WizardHeader
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
            disabled={submitting}
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
                <div className="tablet:grid-cols-4 grid grid-cols-3 gap-2">
                  {photos.map((p) => (
                    <ReviewPhotoTile key={p.id} url={p.url} />
                  ))}
                </div>
              }
            />
          )}
        </div>

        {submitting && (
          <div
            className={`bg-card border-border rounded-16 animate-slide-up flex flex-col gap-3 border p-5 ${hasFailedTask ? "animate-shake" : ""}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="type-body-small font-semibold">
                {phase === "sending"
                  ? t("guest__record__sending")
                  : t("guest__record__uploading_label")}
              </span>
              <span className="type-caption text-muted-foreground tabular-nums transition-opacity duration-200">
                {phase === "sending"
                  ? ""
                  : tasks.length > 0
                    ? `${overallPct}%`
                    : ""}
              </span>
            </div>
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full transition-[width] duration-300 ease-out ${hasFailedTask ? "bg-destructive" : "bg-primary"}`}
                style={{
                  width:
                    phase === "sending"
                      ? "100%"
                      : `${tasks.length > 0 ? overallPct : 0}%`,
                }}
              />
            </div>
          </div>
        )}

        {submitError && (
          <p
            className="type-body-small text-destructive animate-slide-up"
            role="alert"
          >
            {submitError}
          </p>
        )}
      </div>
      <StickyCTA layout="split" caption={t("guest__record__caption")}>
        <div className="tablet:w-auto flex w-full gap-2">
          <Button
            asChild
            type="button"
            variant="outline"
            size="lg"
            className="flex-1 rounded-full"
          >
            <Link href={backHref}>{t("guest__wizard__back")}</Link>
          </Button>
          <Button
            type="button"
            size="lg"
            className="tablet:px-10 flex-1 rounded-full whitespace-nowrap shadow-lg"
            disabled={submitting}
            onClick={handleSubmit}
          >
            <span
              className={`inline-flex items-center gap-2 transition-opacity duration-200 ${submitting ? "opacity-90" : "opacity-100"}`}
            >
              {submitting && (
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              {submitting
                ? t("guest__record__sending")
                : t("guest__record__send")}
            </span>
          </Button>
        </div>
      </StickyCTA>
    </div>
  );
};
