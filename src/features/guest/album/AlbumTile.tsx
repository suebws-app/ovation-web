"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { safeHttpUrl } from "@/lib/utils/safe-url";
import type { GalleryItem } from "@/lib/api/types";
import { AlbumTileActions } from "./AlbumTileActions";

type AlbumTileProps = {
  item: GalleryItem;
  aspect: number;
  onOpen: () => void;
  onLike: () => void;
  onComment: () => void;
  onDelete?: () => void;
};

export const AlbumTile = ({
  item,
  aspect,
  onOpen,
  onLike,
  onComment,
  onDelete,
}: AlbumTileProps) => {
  const t = useTranslations();
  const [failed, setFailed] = useState(false);
  const isVideo = item.type === "video";
  const previewUrl = safeHttpUrl(item.thumbUrl ?? (isVideo ? null : item.url));

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      aria-label={t("guest_gallery__open_preview")}
      style={{ aspectRatio: aspect }}
      className="bg-warm-panel/50 rounded-12 relative w-full cursor-pointer overflow-hidden"
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
      {isVideo && (
        <span className="bg-foreground/60 text-primary-foreground absolute top-2 right-2 flex size-7 items-center justify-center rounded-full">
          <VideoIcon className="size-3.5" aria-hidden />
        </span>
      )}
      <AlbumTileActions
        likeCount={item.likeCount}
        commentCount={item.commentCount}
        likedByMe={item.likedByMe}
        isPinned={Boolean(item.pinnedAt)}
        likeLabel={t("guest__album__like")}
        commentLabel={t("guest__album__comment")}
        onLike={onLike}
        onComment={onComment}
        onDelete={onDelete}
        deleteLabel={t("guest__album__delete")}
      />
    </div>
  );
};
