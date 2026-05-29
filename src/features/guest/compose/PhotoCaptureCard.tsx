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
import { CameraCaptureModal } from "./CameraCaptureModal";

const MAX_BYTES = 25 * 1024 * 1024;
const MAX_DIM = 2048;
const JPEG_QUALITY = 0.85;

const makePhotoId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `p-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const loadImage = (url: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });

const compressImage = async (file: File): Promise<File> => {
  const sourceUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(sourceUrl);
    if (!img) return file;
    const { naturalWidth: w, naturalHeight: h } = img;
    const scale = Math.min(1, MAX_DIM / Math.max(w, h));
    if (scale === 1 && file.type === "image/jpeg") return file;
    const targetW = Math.round(w * scale);
    const targetH = Math.round(h * scale);
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, targetW, targetH);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", JPEG_QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;
    const baseName = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
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
  const [cameraOpen, setCameraOpen] = useState(false);

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

    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        rejectedType = true;
        continue;
      }
      if (file.size > MAX_BYTES) {
        rejectedSize = true;
        continue;
      }
      const photo = await readPhoto(file);
      if (photo) accepted.push(photo);
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

  const handleCameraCapture = async (file: File) => {
    setError(null);
    const available = MAX_PHOTOS - photos.length;
    if (available <= 0) {
      setError(t("guest__compose__photo_max_reached", { max: MAX_PHOTOS }));
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(t("guest__record__photo__error_too_large"));
      return;
    }
    const photo = await readPhoto(file);
    if (photo) addPhotos([photo]);
  };

  const count = photos.length;
  const remaining = MAX_PHOTOS - count;
  const atLimit = remaining <= 0;

  return (
    <div className="bg-card/65 border-border rounded-16 flex flex-col gap-4 border p-4 backdrop-blur-sm">
      <CaptureCardHeader
        icon={<CameraIcon width={18} height={18} />}
        iconClassName="bg-accent"
        title={t("guest__compose__photo_title")}
        meta={
          count > 0
            ? t("guest__compose__photo_count", { count, max: MAX_PHOTOS })
            : t("guest__compose__photo_subtitle_multi", { max: MAX_PHOTOS })
        }
        filled={count > 0}
      />

      {count > 0 && (
        <div className="grid grid-cols-3 gap-2 tablet:grid-cols-4">
          {photos.map((photo) => (
            <PhotoThumb
              key={photo.id}
              photo={photo}
              onRemove={() => removePhoto(photo.id)}
              removeLabel={t("guest__compose__remove")}
            />
          ))}
        </div>
      )}

      <div className="tablet:flex-row flex flex-col gap-2">
        <Button
          variant="outline"
          className="tablet:flex-1 w-full rounded-full"
          onClick={() => setCameraOpen(true)}
          disabled={atLimit}
        >
          <CameraIcon width={14} height={14} />
          {t("guest__compose__take_a_photo")}
        </Button>
        <Button
          variant="outline"
          className="tablet:flex-1 w-full rounded-full"
          onClick={() => galleryInputRef.current?.click()}
          disabled={atLimit}
        >
          <ImageIcon width={14} height={14} />
          {t("guest__compose__choose_from_gallery")}
        </Button>
      </div>

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
        <p className="type-body-small text-destructive" role="alert">
          {error}
        </p>
      )}

      <CameraCaptureModal
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCaptured={handleCameraCapture}
      />
    </div>
  );
};

