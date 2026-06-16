"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { CameraIcon } from "@ovation/icons/CameraIcon";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import {
  MAX_PHOTOS,
  useGuestSubmissionStore,
  type PhotoCapture,
} from "../store/useGuestSubmissionStore";
import { CaptureCardHeader } from "./CaptureCardHeader";
import { PhotoThumb } from "./PhotoThumb";
import { compressImage } from "@/lib/media/compressImage";

const MAX_BYTES = 25 * 1024 * 1024;

const photoToneColor = "oklch(0.42 0.08 65)";

const tonalButtonClass =
  "bg-accent/40 hover:bg-accent/60 rounded-12 tablet:px-5 h-12 gap-2";

const makePhotoId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `p-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const readPhoto = async (file: File): Promise<PhotoCapture | null> => {
  const compressed = await compressImage(file);
  return new Promise((resolve) => {
    const url = URL.createObjectURL(compressed);
    const img = new Image();
    img.onload = () => {
      resolve({
        id: makePhotoId(),
        file: compressed,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
};

export const PhotoCaptureCard = () => {
  const t = useTranslations();
  const photos = useGuestSubmissionStore((s) => s.photos);
  const addPhotos = useGuestSubmissionStore((s) => s.addPhotos);
  const removePhoto = useGuestSubmissionStore((s) => s.removePhoto);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const available = MAX_PHOTOS - photos.length;
    if (available <= 0) {
      setError(t("guest__compose__photo_max_reached", { max: MAX_PHOTOS }));
      return;
    }

    const picked = Array.from(files).slice(0, available);
    const accepted: PhotoCapture[] = [];
    let rejectedSize = false;
    let rejectedType = false;
    const toProcess: File[] = [];

    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        rejectedType = true;
        continue;
      }
      if (file.size > MAX_BYTES) {
        rejectedSize = true;
        continue;
      }
      toProcess.push(file);
    }

    if (toProcess.length > 0) {
      setPendingCount((c) => c + toProcess.length);
      for (const file of toProcess) {
        const photo = await readPhoto(file);
        if (photo) accepted.push(photo);
        setPendingCount((c) => Math.max(0, c - 1));
      }
    }

    if (accepted.length > 0) addPhotos(accepted);
    if (rejectedType) {
      setError(t("guest__record__photo__error_not_image"));
    } else if (rejectedSize) {
      setError(t("guest__record__photo__error_too_large"));
    } else if (files.length > available) {
      setError(t("guest__compose__photo_max_reached", { max: MAX_PHOTOS }));
    }
  };

  const count = photos.length;
  const remaining = MAX_PHOTOS - count;
  const atLimit = remaining <= 0;
  const showInlineCta = count === 0 && pendingCount === 0;

  return (
    <div className="bg-card/70 rounded-16 tablet:p-5 p-4 whitespace-nowrap">
      <div className="tablet:flex-row tablet:items-center flex flex-col gap-4">
        <CaptureCardHeader
          icon={<CameraIcon width={20} height={20} />}
          iconClassName="bg-accent/40"
          iconStyle={{ color: photoToneColor }}
          title={t("guest__compose__photo_title")}
          meta={
            count > 0
              ? t("guest__compose__photo_count", { count, max: MAX_PHOTOS })
              : t("guest__compose__photo_subtitle_multi", { max: MAX_PHOTOS })
          }
        />
        {showInlineCta && (
          <div className="tablet:w-auto flex w-full">
            <Button
              type="button"
              variant="ghost"
              className={`${tonalButtonClass} flex-1`}
              style={{ color: photoToneColor }}
              onClick={() => galleryInputRef.current?.click()}
              disabled={atLimit}
            >
              <ImageIcon width={16} height={16} />
              {t("guest__compose__upload_photo")}
            </Button>
          </div>
        )}
      </div>

      {(count > 0 || pendingCount > 0) && (
        <div className="tablet:grid-cols-4 mt-4 grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <PhotoThumb
              key={photo.id}
              photo={photo}
              onRemove={() => removePhoto(photo.id)}
              removeLabel={t("guest__compose__remove")}
            />
          ))}
          {Array.from({ length: pendingCount }).map((_, i) => (
            <div
              key={`pending-${i}`}
              className="rounded-12 border-border bg-muted/60 animate-slide-up relative flex aspect-square items-center justify-center overflow-hidden border"
              aria-label={t("guest__compose__photo_uploading")}
              role="status"
            >
              <span className="bg-foreground/5 absolute inset-0 animate-pulse" />
              <span className="border-primary relative size-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          ))}
        </div>
      )}

      {(count > 0 || pendingCount > 0) && (
        <div className="mt-4 flex">
          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={() => galleryInputRef.current?.click()}
            disabled={atLimit}
          >
            <ImageIcon width={14} height={14} />
            {t("guest__compose__upload_photo")}
          </Button>
        </div>
      )}

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="type-body-small text-destructive mt-2.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
