"use client";

import { useState } from "react";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import { TrashIcon } from "@ovation/icons/TrashIcon";
import { safeHttpUrl } from "@/lib/utils/safe-url";
import type { GalleryItem } from "@/lib/api/types";

type AlbumCollectionTileProps = {
  item: GalleryItem;
  openLabel: string;
  deleteLabel: string;
  onOpen: () => void;
  onDelete?: () => void;
};

export const AlbumCollectionTile = ({
  item,
  openLabel,
  deleteLabel,
  onOpen,
  onDelete,
}: AlbumCollectionTileProps) => {
  const [failed, setFailed] = useState(false);
  const isVideo = item.type === "video";
  const previewUrl = safeHttpUrl(item.thumbUrl ?? (isVideo ? null : item.url));

  return (
    <div className="rounded-12 bg-warm-panel/50 relative aspect-square w-full max-w-64 overflow-hidden">
      <button
        type="button"
        onClick={onOpen}
        aria-label={openLabel}
        className="size-full cursor-pointer"
      >
        {previewUrl && !failed ? (
          <img
            src={previewUrl}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-muted-foreground flex size-full items-center justify-center">
            <ImageIcon className="size-6" aria-hidden />
          </span>
        )}
      </button>
      {isVideo && (
        <span className="bg-foreground/60 text-primary-foreground absolute top-2 right-2 flex size-7 items-center justify-center rounded-full">
          <VideoIcon className="size-3.5" aria-hidden />
        </span>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label={deleteLabel}
          className="bg-foreground/60 text-primary-foreground absolute right-2 bottom-2 flex size-8 cursor-pointer items-center justify-center rounded-full backdrop-blur"
        >
          <TrashIcon className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
};
