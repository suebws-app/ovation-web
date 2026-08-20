"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { compressImage } from "@/lib/media/compressImage";
import { getBlobDuration } from "@/lib/media/getBlobDuration";
import {
  MAX_PHOTOS,
  MAX_VIDEOS,
  useGuestSubmissionStore,
  type PhotoCapture,
  type VideoCapture,
} from "../store/useGuestSubmissionStore";

const MAX_PHOTO_BYTES = 25 * 1024 * 1024;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

const newId = (prefix: string): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const readPhoto = async (file: File): Promise<PhotoCapture | null> => {
  const compressed = await compressImage(file);
  return new Promise((resolve) => {
    const url = URL.createObjectURL(compressed);
    const img = new Image();
    img.onload = () =>
      resolve({
        id: newId("p"),
        file: compressed,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
};

const readVideo = async (
  file: File,
  maxDurationSec: number,
): Promise<VideoCapture> => {
  const measured = await getBlobDuration(file);
  return {
    id: newId("v"),
    blob: file,
    url: URL.createObjectURL(file),
    durationSec: Math.min(Math.round(measured || 0), maxDurationSec),
    mimeType: file.type,
  };
};

type UseMediaPickerResult = {
  pick: (files: FileList | null) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
  clearError: () => void;
};

export const useMediaPicker = (
  maxVideoDurationSec: number,
): UseMediaPickerResult => {
  const t = useTranslations();
  const photos = useGuestSubmissionStore((s) => s.photos);
  const videos = useGuestSubmissionStore((s) => s.videos);
  const addPhotos = useGuestSubmissionStore((s) => s.addPhotos);
  const addVideo = useGuestSubmissionStore((s) => s.addVideo);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setIsProcessing(true);

    let photoSlots = MAX_PHOTOS - photos.length;
    let videoSlots = MAX_VIDEOS - videos.length;
    const accepted: PhotoCapture[] = [];
    let rejectedSize = false;
    let rejectedType = false;
    let rejectedLimit = false;

    try {
      for (const file of Array.from(files)) {
        if (file.type.startsWith("image/")) {
          if (photoSlots <= 0) {
            rejectedLimit = true;
            continue;
          }
          if (file.size > MAX_PHOTO_BYTES) {
            rejectedSize = true;
            continue;
          }
          const photo = await readPhoto(file);
          if (photo) {
            accepted.push(photo);
            photoSlots -= 1;
          }
          continue;
        }

        if (file.type.startsWith("video/")) {
          if (videoSlots <= 0) {
            rejectedLimit = true;
            continue;
          }
          if (file.size > MAX_VIDEO_BYTES) {
            rejectedSize = true;
            continue;
          }
          addVideo(await readVideo(file, maxVideoDurationSec));
          videoSlots -= 1;
          continue;
        }

        rejectedType = true;
      }

      if (accepted.length > 0) addPhotos(accepted);

      if (rejectedType) setError(t("guest__upload__error_unsupported"));
      else if (rejectedSize)
        setError(t("guest__record__photo__error_too_large"));
      else if (rejectedLimit)
        setError(
          t("guest__upload__error_limit", {
            photos: MAX_PHOTOS,
            videos: MAX_VIDEOS,
          }),
        );
    } finally {
      setIsProcessing(false);
    }
  };

  return { pick, isProcessing, error, clearError: () => setError(null) };
};
