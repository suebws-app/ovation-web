"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { messagesClient } from "@/lib/api/messages-client";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import { queryKeys } from "@/lib/query/keys";
import type { UploadTarget } from "@/lib/api/types";

const findTarget = (
  targets: UploadTarget[],
  kind: "photo" | "video",
): UploadTarget | undefined => targets.find((t) => t.kind === kind);

const readImageDimensions = (file: File) =>
  new Promise<{ width: number; height: number } | null>((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });

const readVideoMetadata = (file: File) =>
  new Promise<{ durationSec: number | null }>((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const dur = Number.isFinite(video.duration) ? video.duration : null;
      resolve({ durationSec: dur != null ? Math.round(dur) : null });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ durationSec: null });
    };
    video.src = url;
  });

const isPhoto = (file: File) => file.type.startsWith("image/");
const isVideo = (file: File) => file.type.startsWith("video/");

export const usePhotoUpload = (eventId: string) => {
  const qc = useQueryClient();
  const t = useTranslations();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPhoto = async (file: File): Promise<void> => {
    const result = await messagesClient.ownerUploadUrls(eventId, {
      photoContentType: file.type,
    });
    const target = findTarget(result.uploadTargets, "photo");
    if (!target) throw new Error(t("photos__upload__error_no_target"));
    await uploadToTarget(target, file);
    const dims = await readImageDimensions(file);
    await messagesClient.ownerCreate(eventId, {
      photoKey: target.key,
      photoWidth: dims?.width ?? null,
      photoHeight: dims?.height ?? null,
    });
  };

  const uploadVideo = async (file: File): Promise<void> => {
    const result = await messagesClient.ownerUploadUrls(eventId, {
      videoContentType: file.type,
    });
    const target = findTarget(result.uploadTargets, "video");
    if (!target) throw new Error(t("photos__upload__error_no_target"));
    await uploadToTarget(target, file);
    const meta = await readVideoMetadata(file);
    await messagesClient.ownerCreate(eventId, {
      videoKey: target.key,
      videoDurationSec: meta.durationSec,
      videoMimeType: file.type,
    });
  };

  const upload = async (files: File[]): Promise<void> => {
    if (files.length === 0) return;
    setIsUploading(true);
    setError(null);
    try {
      for (const file of files) {
        if (isPhoto(file)) await uploadPhoto(file);
        else if (isVideo(file)) await uploadVideo(file);
      }
      qc.invalidateQueries({ queryKey: queryKeys.messages.all(eventId) });
      qc.invalidateQueries({ queryKey: queryKeys.events.stats(eventId) });
    } catch (err) {
      console.error("[photos:upload] failed", err);
      const message =
        err instanceof Error ? err.message : t("photos__upload__error_generic");
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error };
};
