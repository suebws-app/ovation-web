"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { useRouter } from "@/i18n/navigation";
import { eventsClient } from "@/lib/api/events-client";
import { ApiError } from "@/lib/api/client";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import { compressImage } from "@/lib/media/compressImage";
import { ACCEPT_MIME, MAX_BYTES } from "@/features/create/constants";
import type { CoverPhotoContentType } from "@/lib/api/types";

const ALLOWED_MIMES: Record<string, CoverPhotoContentType> = {
  "image/jpeg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
  "image/heic": "image/heic",
};

type Status =
  | { kind: "idle" }
  | { kind: "uploading" }
  | { kind: "removing" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

type LinkCouplePhotoCardProps = {
  eventId: string;
  initialPhotoUrl: string | null;
};

export const LinkCouplePhotoCard = ({
  eventId,
  initialPhotoUrl,
}: LinkCouplePhotoCardProps) => {
  const t = useTranslations();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const displayUrl = previewUrl ?? photoUrl;
  const busy = status.kind === "uploading" || status.kind === "removing";

  const handlePick = () => inputRef.current?.click();

  const handleFile = async (file: File) => {
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
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    try {
      const compressed = await compressImage(file);
      const contentType = ALLOWED_MIMES[compressed.type] ?? "image/jpeg";
      const result = await eventsClient.coverUploadUrl(eventId, contentType);
      await uploadToTarget(
        { url: result.uploadUrl, key: result.key },
        compressed,
      );
      const { event: updated } = await eventsClient.update(eventId, {
        couplePhotoUrl: result.publicUrl,
      });
      setPhotoUrl(updated.couplePhotoUrl);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setStatus({ kind: "saved" });
      router.refresh();
    } catch (error) {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setStatus({
        kind: "error",
        message: ApiError.isApiError(error)
          ? error.message
          : t("settings__couple_photo__upload_error"),
      });
    }
  };

  const handleRemove = async () => {
    setStatus({ kind: "removing" });
    try {
      const { event: updated } = await eventsClient.update(eventId, {
        couplePhotoUrl: null,
      });
      setPhotoUrl(updated.couplePhotoUrl);
      setStatus({ kind: "saved" });
      router.refresh();
    } catch (error) {
      setStatus({
        kind: "error",
        message: ApiError.isApiError(error)
          ? error.message
          : t("settings__couple_photo__upload_error"),
      });
    }
  };

  return (
    <div className="rounded-16 border-border bg-card tablet:p-6 flex flex-col gap-5 border p-5">
      <div>
        <p className="type-overline text-muted-foreground tracking-[2px]">
          {t("settings__couple_photo__eyebrow")}
        </p>
        <p className="tablet:type-h2 type-h3 mt-1.5 leading-snug font-semibold tracking-tight">
          {t("settings__couple_photo__title")}
        </p>
        <p className="type-body-small text-muted-foreground mt-1.5">
          {t("settings__couple_photo__section_description")}
        </p>
      </div>

      <div className="tablet:flex-row tablet:items-center flex flex-col gap-5">
        <div className="rounded-16 border-border bg-muted/50 relative flex size-28 shrink-0 items-center justify-center overflow-hidden border">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <ImageIcon
              width={28}
              height={28}
              className="text-muted-foreground"
            />
          )}
          {status.kind === "uploading" && (
            <div className="bg-foreground/30 absolute inset-0 flex items-center justify-center">
              <span className="border-primary-foreground size-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="type-caption text-muted-foreground">
            {t("settings__couple_photo__hint")}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={handlePick}
              disabled={busy}
            >
              {status.kind === "uploading"
                ? t("settings__couple_photo__uploading")
                : photoUrl
                  ? t("settings__couple_photo__change")
                  : t("settings__couple_photo__upload")}
            </Button>
            {photoUrl && (
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                onClick={handleRemove}
                disabled={busy}
              >
                {status.kind === "removing"
                  ? t("settings__couple_photo__removing")
                  : t("settings__couple_photo__remove")}
              </Button>
            )}
          </div>

          {status.kind === "error" && (
            <p className="type-caption text-destructive mt-2" role="alert">
              {status.message}
            </p>
          )}
          {status.kind === "saved" && (
            <p className="type-caption text-secondary mt-2">
              {t("settings__couple_photo__saved")}
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MIME}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
};
