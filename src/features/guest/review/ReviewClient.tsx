"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Card, CardContent } from "@ovation/ui/components/Card";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { MicIcon } from "@ovation/icons/MicIcon";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import { MessageSquareIcon } from "@ovation/icons/MessageSquareIcon";
import { CameraIcon } from "@ovation/icons/CameraIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { RefreshIcon } from "@ovation/icons/RefreshIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { LazyVideoPlayer } from "@/components/LazyVideoPlayer";
import { toast } from "@/components/Toaster";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { publicClient, type UploadMediaItem } from "@/lib/api/public-client";
import { uploadToTarget, UploadError } from "@/lib/media/uploadToTarget";
import { videoMimeFromType } from "@/lib/utils/videoMime";
import { WizardHeader } from "../shell/WizardHeader";
import { StickyCTA } from "../shell/StickyCTA";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { ReviewItem } from "./ReviewItem";
import { ReviewPhotoTile } from "./ReviewPhotoTile";

type ItemKind = "audio" | "video" | "photo";
type ItemStatus = "queued" | "uploading" | "done" | "failed";

type UploadItem = {
  id: string;
  kind: ItemKind;
  label: string;
  pct: number;
  status: ItemStatus;
  audioKey?: string;
  mediaId?: string;
  photoIndex?: number;
};

type SubmitPhase =
  | "idle"
  | "uploading"
  | "awaiting_retry"
  | "sending"
  | "success";

const SUCCESS_DELAY_MS = 700;

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

const useBeforeUnloadGuard = (active: boolean) => {
  useEffect(() => {
    if (!active) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [active]);
};

const iconForKind = (kind: ItemKind) => {
  if (kind === "audio") return <MicIcon width={16} height={16} />;
  if (kind === "video") return <VideoIcon width={16} height={16} />;
  return <CameraIcon width={16} height={16} />;
};

type UploadRowProps = {
  item: UploadItem;
  onRetry: (id: string) => void;
  retryLabel: string;
};

const UploadRow = ({ item, onRetry, retryLabel }: UploadRowProps) => {
  const barColor =
    item.status === "failed"
      ? "bg-destructive"
      : item.status === "done"
        ? "bg-success"
        : "bg-primary";
  return (
    <div className="flex items-center gap-3">
      <span className="bg-muted text-muted-foreground rounded-8 flex size-8 shrink-0 items-center justify-center">
        {iconForKind(item.kind)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="type-body-small truncate font-medium">
            {item.label}
          </span>
          <span className="type-caption text-muted-foreground shrink-0 tabular-nums">
            {item.status === "done"
              ? "100%"
              : item.status === "failed"
                ? ""
                : `${item.pct}%`}
          </span>
        </div>
        <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ease-out ${barColor}`}
            style={{
              width:
                item.status === "done" || item.status === "failed"
                  ? "100%"
                  : `${item.pct}%`,
            }}
          />
        </div>
      </div>
      {item.status === "done" && (
        <span
          className="bg-success/15 text-success flex size-7 shrink-0 items-center justify-center rounded-full"
          aria-hidden
        >
          <CheckIcon width={14} height={14} />
        </span>
      )}
      {item.status === "failed" && (
        <>
          <span
            className="bg-destructive/15 text-destructive flex size-7 shrink-0 items-center justify-center rounded-full"
            aria-hidden
          >
            <XIcon width={14} height={14} />
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="shrink-0 rounded-full"
            onClick={() => onRetry(item.id)}
          >
            <RefreshIcon width={12} height={12} />
            {retryLabel}
          </Button>
        </>
      )}
    </div>
  );
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
  const inviteToken = useGuestSubmissionStore((s) => s.inviteToken);
  const [phase, setPhase] = useState<SubmitPhase>("idle");
  const [items, setItems] = useState<UploadItem[]>([]);
  const [nameInvalid, setNameInvalid] = useState(false);
  const [idempotencyKey] = useState(newIdempotencyKey);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const audioKeyRef = useRef<string | null>(null);
  const mediaIdsByItemRef = useRef<Map<string, string>>(new Map());

  const isInFlight = phase === "uploading" || phase === "sending";

  useBeforeUnloadGuard(isInFlight);

  const hasNote = note.trim().length > 0;
  const hasPhotos = photos.length > 0;
  const hasAnyContent = Boolean(audio || video) || hasPhotos || hasNote;

  const overallPct = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round(
      items.reduce((acc, item) => acc + item.pct, 0) / items.length,
    );
  }, [items]);

  const failedCount = items.filter((i) => i.status === "failed").length;
  const successHref =
    submissionSource === "kiosk"
      ? `/${locale}/kiosk/${slug}?submitted=1`
      : `/${locale}/g/${slug}/thank-you`;

  useEffect(() => {
    router.prefetch(successHref);
  }, [router, successHref]);

  const patchItem = useCallback((id: string, patch: Partial<UploadItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  const finalizeMessage = useCallback(async () => {
    setPhase("sending");
    const collectedMediaIds = Array.from(mediaIdsByItemRef.current.values());

    try {
      await publicClient.createMessage(slug, idempotencyKey, {
        guestNames: guestName.trim(),
        audioKey: audioKeyRef.current,
        audioDurationSec: audio?.durationSec ?? null,
        audioMimeType: audio ? stripMimeParams(audio.mimeType) : null,
        mediaIds: collectedMediaIds.length ? collectedMediaIds : undefined,
        writtenNote: hasNote ? note.trim() : null,
        submissionSource,
        submissionLanguage: locale,
        clientCreatedAt: new Date().toISOString(),
        inviteToken: inviteToken ?? undefined,
        _honeypot: "",
        _t: sessionStartAt ?? Date.now() - 5000,
      });

      setPhase("success");
      setTimeout(() => {
        router.replace(successHref);
        reset();
      }, SUCCESS_DELAY_MS);
    } catch (error) {
      toast.error(mapSubmitError(error, t));
      setPhase("awaiting_retry");
    }
  }, [
    slug,
    idempotencyKey,
    guestName,
    audio,
    hasNote,
    note,
    submissionSource,
    locale,
    inviteToken,
    sessionStartAt,
    reset,
    router,
    successHref,
    t,
  ]);

  const uploadItems = useCallback(
    async (targets: UploadItem[]): Promise<{ anyFailed: boolean }> => {
      if (targets.length === 0) return { anyFailed: false };

      const needsAudio = targets.some((i) => i.kind === "audio");
      const needsVideo = targets.some((i) => i.kind === "video");
      const needsPhotos = targets.filter((i) => i.kind === "photo");

      const mediaRequest: UploadMediaItem[] = [];
      if (needsVideo && video)
        mediaRequest.push({
          type: "video",
          contentType: stripMimeParams(video.mimeType),
        });
      needsPhotos.forEach((item) => {
        const idx = item.photoIndex ?? 0;
        const p = photos[idx];
        if (p) mediaRequest.push({ type: "photo", contentType: p.file.type });
      });

      const uploadResult = await publicClient.uploadUrls(slug, {
        audioContentType:
          needsAudio && audio ? stripMimeParams(audio.mimeType) : null,
        media: mediaRequest.length > 0 ? mediaRequest : undefined,
        source: submissionSource,
        _honeypot: "",
        _t: sessionStartAt ?? Date.now() - 5000,
      });

      const jobs: Array<Promise<boolean>> = [];
      let photoTargetIdx = 0;
      const photoTargets = uploadResult.mediaTargets.filter(
        (m) => m.type === "photo",
      );

      for (const item of targets) {
        patchItem(item.id, { status: "uploading", pct: 0 });

        if (item.kind === "audio" && audio) {
          const target = uploadResult.audioTargets[0];
          if (!target) {
            patchItem(item.id, { status: "failed" });
            jobs.push(Promise.resolve(false));
            continue;
          }
          jobs.push(
            uploadToTarget(target, audio.blob, {
              onProgress: (pct) => patchItem(item.id, { pct }),
            })
              .then(() => {
                audioKeyRef.current = target.key;
                patchItem(item.id, {
                  status: "done",
                  pct: 100,
                  audioKey: target.key,
                });
                return true;
              })
              .catch(() => {
                patchItem(item.id, { status: "failed" });
                return false;
              }),
          );
          continue;
        }

        if (item.kind === "video" && video) {
          const target = uploadResult.mediaTargets.find(
            (m) => m.type === "video",
          );
          if (!target) {
            patchItem(item.id, { status: "failed" });
            jobs.push(Promise.resolve(false));
            continue;
          }
          jobs.push(
            uploadToTarget(target, video.blob, {
              onProgress: (pct) => patchItem(item.id, { pct }),
            })
              .then(() => {
                mediaIdsByItemRef.current.set(item.id, target.mediaId);
                patchItem(item.id, {
                  status: "done",
                  pct: 100,
                  mediaId: target.mediaId,
                });
                return true;
              })
              .catch(() => {
                patchItem(item.id, { status: "failed" });
                return false;
              }),
          );
          continue;
        }

        if (item.kind === "photo") {
          const idx = item.photoIndex ?? 0;
          const photo = photos[idx];
          const target = photoTargets[photoTargetIdx++];
          if (!photo || !target) {
            patchItem(item.id, { status: "failed" });
            jobs.push(Promise.resolve(false));
            continue;
          }
          jobs.push(
            uploadToTarget(target, photo.file, {
              onProgress: (pct) => patchItem(item.id, { pct }),
            })
              .then(() => {
                mediaIdsByItemRef.current.set(item.id, target.mediaId);
                patchItem(item.id, {
                  status: "done",
                  pct: 100,
                  mediaId: target.mediaId,
                });
                return true;
              })
              .catch(() => {
                patchItem(item.id, { status: "failed" });
                return false;
              }),
          );
        }
      }

      const results = await Promise.all(jobs);
      return { anyFailed: results.some((ok) => !ok) };
    },
    [audio, video, photos, slug, submissionSource, sessionStartAt, patchItem],
  );

  const handleSubmit = async () => {
    if (guestName.trim().length === 0) {
      setNameInvalid(true);
      nameInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      nameInputRef.current?.focus({ preventScroll: true });
      return;
    }
    if (!hasAnyContent) {
      toast.error(t("guest__review__error_missing_content"));
      return;
    }

    audioKeyRef.current = null;
    mediaIdsByItemRef.current = new Map();

    const initial: UploadItem[] = [];
    if (audio) {
      initial.push({
        id: "audio",
        kind: "audio",
        label: t("guest__compose__voice_title"),
        pct: 0,
        status: "queued",
      });
    }
    if (video) {
      initial.push({
        id: "video",
        kind: "video",
        label: t("guest__compose__video_title"),
        pct: 0,
        status: "queued",
      });
    }
    photos.forEach((_, i) => {
      initial.push({
        id: `photo-${i}`,
        kind: "photo",
        label:
          photos.length === 1
            ? t("guest__compose__photo_title")
            : `${t("guest__compose__photo_title")} ${i + 1}`,
        pct: 0,
        status: "queued",
        photoIndex: i,
      });
    });

    setItems(initial);
    setPhase("uploading");

    if (initial.length === 0) {
      await finalizeMessage();
      return;
    }

    try {
      const { anyFailed } = await uploadItems(initial);
      if (anyFailed) {
        setPhase("awaiting_retry");
        return;
      }
      await finalizeMessage();
    } catch (error) {
      toast.error(mapSubmitError(error, t));
      setPhase("awaiting_retry");
    }
  };

  const runRetry = useCallback(
    async (retryItems: UploadItem[]) => {
      if (retryItems.length === 0) {
        await finalizeMessage();
        return;
      }
      retryItems.forEach((item) =>
        patchItem(item.id, { status: "queued", pct: 0 }),
      );
      setPhase("uploading");
      try {
        const { anyFailed } = await uploadItems(retryItems);
        if (anyFailed) {
          setPhase("awaiting_retry");
          return;
        }
        await finalizeMessage();
      } catch (error) {
        toast.error(mapSubmitError(error, t));
        setPhase("awaiting_retry");
      }
    },
    [finalizeMessage, patchItem, uploadItems, t],
  );

  const handleRetryItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    runRetry([item]);
  };

  const handleRetryAllFailed = () => {
    const failed = items.filter((i) => i.status === "failed");
    runRetry(failed);
  };

  const isKioskSession = submissionSource === "kiosk";
  const sourceQuery = isKioskSession ? "?source=kiosk" : "";
  const backHref = `/g/${slug}/compose${sourceQuery}`;

  const statusLine =
    phase === "success"
      ? t("guest__record__sent")
      : phase === "sending"
        ? t("guest__record__sending")
        : phase === "awaiting_retry"
          ? t("guest__record__error_network_retry")
          : t("guest__record__uploading_label");

  const showContent = phase === "idle";
  const showProgress = phase !== "idle";

  return (
    <div className="flex flex-1 flex-col">
      <div className="tablet:px-8 small-desktop:px-10 small-desktop:py-9 flex flex-1 flex-col gap-6 px-5 pt-5 pb-9">
        {!showProgress && (
          <WizardHeader
            step={2}
            totalSteps={2}
            title={t("guest__review__title")}
            subtitle={t("guest__review__subtitle")}
          />
        )}

        {showContent && (
          <>
            <Card>
              <CardContent>
                <Label htmlFor="guest-name" className="mb-2">
                  {t("guest__record__name_label")}
                </Label>
                <Input
                  ref={nameInputRef}
                  id="guest-name"
                  type="text"
                  autoComplete="name"
                  placeholder={t("guest__record__name_placeholder")}
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    if (nameInvalid && e.target.value.trim().length > 0) {
                      setNameInvalid(false);
                    }
                  }}
                  aria-invalid={nameInvalid}
                  aria-describedby={
                    nameInvalid ? "guest-name-error" : undefined
                  }
                  className={
                    nameInvalid
                      ? "border-destructive ring-destructive ring-2"
                      : undefined
                  }
                />
                {nameInvalid && (
                  <p
                    id="guest-name-error"
                    role="alert"
                    className="type-body-small text-destructive mt-2"
                  >
                    {t("guest__review__error_missing_name")}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2.5">
              {audio && (
                <ReviewItem
                  icon={<MicIcon width={18} height={18} />}
                  iconClassName="bg-primary"
                  title={t("guest__compose__voice_title")}
                  meta={t("guest__compose__voice_captured", {
                    duration: formatTime(audio.durationSec),
                  })}
                  preview={
                    <audio src={audio.url} controls className="w-full" />
                  }
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
                    <div className="rounded-12 bg-muted tablet:max-h-80 relative max-h-56 w-full overflow-hidden">
                      <LazyVideoPlayer
                        key={video.url}
                        src={video.url}
                        type={videoMimeFromType(video.mimeType)}
                        load="eager"
                        preload="metadata"
                        className="size-full"
                      />
                    </div>
                  }
                />
              )}
              {hasNote && (
                <ReviewItem
                  icon={<MessageSquareIcon width={18} height={18} />}
                  iconClassName="bg-secondary"
                  title={t("guest__compose__note_title")}
                  preview={
                    <p className="bg-background/60 type-body rounded-12 p-3.5 leading-relaxed">
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
          </>
        )}

        {showProgress && (
          <Card className="animate-slide-up">
            <CardContent className="flex flex-col gap-4">
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="flex items-center justify-between gap-3"
              >
                <span className="type-body-small flex items-center gap-2 font-semibold">
                  {phase === "success" && (
                    <span className="bg-success text-success-foreground flex size-6 items-center justify-center rounded-full">
                      <CheckIcon width={14} height={14} />
                    </span>
                  )}
                  {(phase === "uploading" || phase === "sending") && (
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  {statusLine}
                </span>
                <span className="type-caption text-muted-foreground shrink-0 tabular-nums">
                  {phase === "uploading" && items.length > 0
                    ? `${overallPct}%`
                    : ""}
                </span>
              </div>

              {items.length > 0 && (
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <UploadRow
                      key={item.id}
                      item={item}
                      onRetry={handleRetryItem}
                      retryLabel={t("common__retry")}
                    />
                  ))}
                </div>
              )}

              {phase === "awaiting_retry" && failedCount > 0 && (
                <div className="tablet:flex-row flex flex-col gap-2">
                  <Button
                    type="button"
                    onClick={handleRetryAllFailed}
                    className="flex-1 rounded-full"
                  >
                    <RefreshIcon width={14} height={14} />
                    {t("common__retry")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      {showContent && (
        <StickyCTA layout="split" caption={t("guest__record__caption")}>
          <div className="tablet:w-auto flex w-full gap-2">
            <Button asChild type="button" variant="outline" className="flex-1">
              <Link href={backHref}>{t("guest__wizard__back")}</Link>
            </Button>
            <Button
              type="button"
              className="tablet:w-auto tablet:px-10 flex-1 whitespace-nowrap shadow-lg"
              onClick={handleSubmit}
            >
              {t("guest__record__send")}
            </Button>
          </div>
        </StickyCTA>
      )}
    </div>
  );
};
