"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import { DownloadIcon } from "@ovation/icons/DownloadIcon";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { safeHttpUrl } from "@/lib/utils/safe-url";
import type { GalleryItem } from "@/lib/api/types";
import { downloadGalleryItem } from "../utils/download";

type PublicGalleryTileProps = {
  item: GalleryItem;
  height: number;
  slug: string;
  code: string;
  onOpen: () => void;
};

export const PublicGalleryTile = ({
  item,
  height,
  slug,
  code,
  onOpen,
}: PublicGalleryTileProps) => {
  const t = useTranslations();
  const [failed, setFailed] = useState(false);
  const isVideo = item.type === "video";
  const previewUrl = item.thumbUrl ?? (isVideo ? null : item.url);
  const downloadUrl = safeHttpUrl(item.url ?? item.thumbUrl);
  const caption = item.uploaderName?.trim() || t("guest_gallery__anonymous");
  const showFallback = !previewUrl || failed;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!downloadUrl) return;
    try {
      await downloadGalleryItem(slug, code, item.id);
    } catch (err) {
      console.error("[public-gallery] download failed", err);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label={t("guest_gallery__open_preview")}
      style={{ height }}
      className="group rounded-12 bg-muted relative w-full cursor-pointer overflow-hidden shadow-sm transition-transform hover:scale-[1.01]"
    >
      {showFallback ? (
        <div className="text-muted-foreground/40 flex size-full items-center justify-center">
          <ImageIcon width={32} height={32} />
        </div>
      ) : (
        <img
          src={previewUrl ?? ""}
          alt={caption}
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      )}

      {isVideo && (
        <span className="bg-background/80 text-foreground absolute top-2 left-2 inline-flex size-7 items-center justify-center rounded-full">
          <VideoIcon width={14} height={14} />
        </span>
      )}

      {downloadUrl && (
        <button
          type="button"
          onClick={handleDownload}
          aria-label={t("guest_gallery__download")}
          className="bg-background/80 text-foreground hover:bg-background absolute top-2 right-2 inline-flex size-8 cursor-pointer items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        >
          <DownloadIcon width={14} height={14} />
        </button>
      )}
    </div>
  );
};
