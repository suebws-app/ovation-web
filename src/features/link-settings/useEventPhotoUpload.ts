"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { eventsClient } from "@/lib/api/events-client";
import { ApiError } from "@/lib/api/client";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import { compressImage } from "@/lib/media/compressImage";
import { MAX_BYTES } from "@/features/create/constants";
import type { CoverPhotoContentType } from "@/lib/api/types";

const ALLOWED_MIMES: Record<string, CoverPhotoContentType> = {
  "image/jpeg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
  "image/heic": "image/heic",
};

export type EventPhotoField = "coverPhotoUrl" | "hostAvatarUrl";

export type EventPhotoStatus =
  | { kind: "idle" }
  | { kind: "uploading" }
  | { kind: "removing" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

type UseEventPhotoUploadOptions = {
  eventId: string;
  field: EventPhotoField;
  initialUrl: string | null;
  errorMessage: string;
};

export const useEventPhotoUpload = ({
  eventId,
  field,
  initialUrl,
  errorMessage,
}: UseEventPhotoUploadOptions) => {
  const t = useTranslations();
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<EventPhotoStatus>({ kind: "idle" });
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const setPreview = (url: string | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = url;
    setPreviewUrl(url);
  };

  const presign = (contentType: CoverPhotoContentType) =>
    field === "coverPhotoUrl"
      ? eventsClient.coverUploadUrl(eventId, contentType)
      : eventsClient.assetUploadUrl(eventId, "hostavatar", contentType);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/") || !ALLOWED_MIMES[file.type]) {
      setStatus({
        kind: "error",
        message: t("guest__record__photo__error_not_image"),
      });
      return;
    }
    if (file.size > MAX_BYTES) {
      setStatus({
        kind: "error",
        message: t("guest__record__photo__error_too_large"),
      });
      return;
    }

    setStatus({ kind: "uploading" });
    setPreview(URL.createObjectURL(file));
    try {
      const compressed = await compressImage(file);
      const contentType = ALLOWED_MIMES[compressed.type] ?? "image/jpeg";
      const result = await presign(contentType);
      await uploadToTarget(
        { url: result.uploadUrl, key: result.key },
        compressed,
      );
      const { event: updated } = await eventsClient.update(eventId, {
        [field]: result.publicUrl,
      });
      setPhotoUrl(updated[field] ?? null);
      setPreview(null);
      setStatus({ kind: "saved" });
      router.refresh();
    } catch (error) {
      setPreview(null);
      setStatus({
        kind: "error",
        message: ApiError.isApiError(error) ? error.message : errorMessage,
      });
    }
  };

  const remove = async () => {
    setStatus({ kind: "removing" });
    try {
      const { event: updated } = await eventsClient.update(eventId, {
        [field]: null,
      });
      setPhotoUrl(updated[field] ?? null);
      setStatus({ kind: "saved" });
      router.refresh();
    } catch (error) {
      setStatus({
        kind: "error",
        message: ApiError.isApiError(error) ? error.message : errorMessage,
      });
    }
  };

  return {
    displayUrl: previewUrl ?? photoUrl,
    photoUrl,
    status,
    busy: status.kind === "uploading" || status.kind === "removing",
    upload,
    remove,
  };
};
