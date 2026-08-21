"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "@/components/Toaster";
import { ApiError } from "@/lib/api/client";
import { publicClient, type UploadMediaItem } from "@/lib/api/public-client";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";

export type UploadItemKind = "audio" | "video" | "photo";
export type UploadItemStatus = "queued" | "uploading" | "done" | "failed";

export type UploadItem = {
  id: string;
  kind: UploadItemKind;
  label: string;
  pct: number;
  status: UploadItemStatus;
  mediaId?: string;
  photoIndex?: number;
  videoIndex?: number;
};

export type SubmitPhase =
  | "idle"
  | "uploading"
  | "awaiting_retry"
  | "sending"
  | "success";

const SUCCESS_DELAY_MS = 700;

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
    if (error.i18nKey) return t(error.i18nKey.replace(":", "__"));
    if (error.status === 429) return t("guest__record__error_rate_limited");
    if (error.status === 413) return t("guest__record__error_too_large");
  }
  return t("guest__record__error_default");
};

const useBeforeUnloadGuard = (active: boolean) => {
  useEffect(() => {
    if (!active) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [active]);
};

type UseGuestSubmitResult = {
  phase: SubmitPhase;
  items: UploadItem[];
  isInFlight: boolean;
  submit: () => Promise<void>;
  retryFailed: () => Promise<void>;
};

export const useGuestSubmit = (
  slug: string,
  sourceParam: string | null,
): UseGuestSubmitResult => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const submissionSource = readSubmissionSource(sourceParam);

  const guestName = useGuestSubmissionStore((s) => s.guestName);
  const audio = useGuestSubmissionStore((s) => s.audio);
  const videos = useGuestSubmissionStore((s) => s.videos);
  const photos = useGuestSubmissionStore((s) => s.photos);
  const note = useGuestSubmissionStore((s) => s.note);
  const sessionStartAt = useGuestSubmissionStore((s) => s.sessionStartAt);
  const inviteToken = useGuestSubmissionStore((s) => s.inviteToken);
  const reset = useGuestSubmissionStore((s) => s.reset);

  const [phase, setPhase] = useState<SubmitPhase>("idle");
  const [items, setItems] = useState<UploadItem[]>([]);
  const [idempotencyKey] = useState(newIdempotencyKey);
  const audioKeyRef = useRef<string | null>(null);
  const mediaIdsByItemRef = useRef<Map<string, string>>(new Map());

  const isInFlight = phase === "uploading" || phase === "sending";
  useBeforeUnloadGuard(isInFlight);

  const successHref =
    submissionSource === "kiosk"
      ? `/${locale}/kiosk/${slug}?submitted=1`
      : `/${locale}/g/${slug}/thank-you`;

  const patchItem = useCallback((id: string, patch: Partial<UploadItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  const finalizeMessage = useCallback(async () => {
    setPhase("sending");
    const collectedMediaIds = Array.from(mediaIdsByItemRef.current.values());
    const hasNote = note.trim().length > 0;

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

      const needsAudio = targets.some((item) => item.kind === "audio");
      const mediaRequest: UploadMediaItem[] = [];
      targets
        .filter((item) => item.kind === "video")
        .forEach((item) => {
          const video = videos[item.videoIndex ?? 0];
          if (video)
            mediaRequest.push({
              type: "video",
              contentType: stripMimeParams(video.mimeType),
            });
        });
      targets
        .filter((item) => item.kind === "photo")
        .forEach((item) => {
          const photo = photos[item.photoIndex ?? 0];
          if (photo)
            mediaRequest.push({ type: "photo", contentType: photo.file.type });
        });

      const uploadResult = await publicClient.uploadUrls(slug, {
        audioContentType:
          needsAudio && audio ? stripMimeParams(audio.mimeType) : null,
        media: mediaRequest.length > 0 ? mediaRequest : undefined,
        source: submissionSource,
        _honeypot: "",
        _t: sessionStartAt ?? Date.now() - 5000,
      });

      const photoTargets = uploadResult.mediaTargets.filter(
        (target) => target.type === "photo",
      );
      const videoTargets = uploadResult.mediaTargets.filter(
        (target) => target.type === "video",
      );
      let photoTargetIdx = 0;
      let videoTargetIdx = 0;
      const jobs: Array<Promise<boolean>> = [];

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
                patchItem(item.id, { status: "done", pct: 100 });
                return true;
              })
              .catch(() => {
                patchItem(item.id, { status: "failed" });
                return false;
              }),
          );
          continue;
        }

        const isVideo = item.kind === "video";
        const source = isVideo
          ? videos[item.videoIndex ?? 0]
          : photos[item.photoIndex ?? 0];
        const target = isVideo
          ? videoTargets[videoTargetIdx++]
          : photoTargets[photoTargetIdx++];

        if (!source || !target) {
          patchItem(item.id, { status: "failed" });
          jobs.push(Promise.resolve(false));
          continue;
        }

        const blob = "blob" in source ? source.blob : source.file;
        jobs.push(
          uploadToTarget(target, blob, {
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

      const results = await Promise.all(jobs);
      return { anyFailed: results.some((ok) => !ok) };
    },
    [audio, videos, photos, slug, submissionSource, sessionStartAt, patchItem],
  );

  const runUpload = useCallback(
    async (targets: UploadItem[]) => {
      if (targets.length === 0) {
        await finalizeMessage();
        return;
      }
      setPhase("uploading");
      try {
        const { anyFailed } = await uploadItems(targets);
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
    [finalizeMessage, uploadItems, t],
  );

  const submit = useCallback(async () => {
    audioKeyRef.current = null;
    mediaIdsByItemRef.current = new Map();

    const queued: UploadItem[] = [];
    if (audio) {
      queued.push({
        id: "audio",
        kind: "audio",
        label: t("guest__compose__voice_title"),
        pct: 0,
        status: "queued",
      });
    }
    videos.forEach((_, index) => {
      queued.push({
        id: `video-${index}`,
        kind: "video",
        label:
          videos.length === 1
            ? t("guest__compose__video_title")
            : `${t("guest__compose__video_title")} ${index + 1}`,
        pct: 0,
        status: "queued",
        videoIndex: index,
      });
    });
    photos.forEach((_, index) => {
      queued.push({
        id: `photo-${index}`,
        kind: "photo",
        label:
          photos.length === 1
            ? t("guest__compose__photo_title")
            : `${t("guest__compose__photo_title")} ${index + 1}`,
        pct: 0,
        status: "queued",
        photoIndex: index,
      });
    });

    setItems(queued);
    await runUpload(queued);
  }, [audio, videos, photos, runUpload, t]);

  const retryFailed = useCallback(async () => {
    const failed = items.filter((item) => item.status === "failed");
    failed.forEach((item) => patchItem(item.id, { status: "queued", pct: 0 }));
    await runUpload(failed);
  }, [items, patchItem, runUpload]);

  return { phase, items, isInFlight, submit, retryFailed };
};
