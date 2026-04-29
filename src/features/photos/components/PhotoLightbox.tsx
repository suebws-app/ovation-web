"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft } from "@ovation/icons/ChevronLeft";
import { ChevronRight } from "@ovation/icons/ChevronRight";
import { XIcon } from "@ovation/icons/XIcon";
import { Heart } from "@ovation/icons/Heart";
import { Download } from "@ovation/icons/Download";
import { cn } from "@ovation/ui/utils/cn";
import {
  useMessageDetail,
  useUpdateMessage,
} from "@/lib/query/messagesQueries";
import type { PhotoView } from "../adapters";

type PhotoLightboxProps = {
  eventId: string;
  photos: PhotoView[];
  index: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  onLoadMore: () => void;
};

const PREFETCH_THRESHOLD = 3;

const sanitizeFilename = (s: string): string =>
  s.replace(/[^\p{L}\p{N}\-_ ]+/gu, "").trim() || "photo";

const extFromUrl = (url: string, fallback: string): string => {
  try {
    const path = new URL(url).pathname;
    const m = path.match(/\.([a-zA-Z0-9]{2,5})$/);
    return m ? m[1].toLowerCase() : fallback;
  } catch {
    return fallback;
  }
};

const downloadAsBlob = async (url: string, filename: string): Promise<void> => {
  const res = await fetch(url, { credentials: "omit" });
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};

export const PhotoLightbox = ({
  eventId,
  photos,
  index,
  hasNextPage,
  isFetchingNextPage,
  onClose,
  onIndexChange,
  onLoadMore,
}: PhotoLightboxProps) => {
  const t = useTranslations();
  const total = photos.length;
  const photo = photos[index] ?? null;
  const { data: detail } = useMessageDetail(eventId, photo?.id ?? null);
  const update = useUpdateMessage(eventId);

  const dragStartX = useRef<number | null>(null);
  const activeThumbRef = useRef<HTMLButtonElement | null>(null);

  const goPrev = useCallback(() => {
    if (index > 0) onIndexChange(index - 1);
  }, [index, onIndexChange]);

  const goNext = useCallback(() => {
    if (index < total - 1) {
      onIndexChange(index + 1);
    } else if (hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [
    index,
    total,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    onIndexChange,
  ]);

  useEffect(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      index >= total - PREFETCH_THRESHOLD
    ) {
      onLoadMore();
    }
  }, [index, total, hasNextPage, isFetchingNextPage, onLoadMore]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index]);

  if (!photo) return null;

  const fullUrl = detail?.message.photoUrl ?? photo.thumbUrl;
  const favorited = photo.favorited;

  const handleToggleFavorite = () => {
    update.mutate({
      messageId: photo.id,
      input: { isFavorite: !favorited },
    });
  };

  const handleDownload = async () => {
    if (!fullUrl) return;
    try {
      const ext = extFromUrl(fullUrl, "jpg");
      const filename = `${sanitizeFilename(photo.name)}.${ext}`;
      await downloadAsBlob(fullUrl, filename);
    } catch (err) {
      console.error("[lightbox] download failed", err);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStartX.current;
    dragStartX.current = null;
    if (start == null) return;
    const dx = e.clientX - start;
    if (dx > 60) goPrev();
    else if (dx < -60) goNext();
  };

  const canGoPrev = index > 0;
  const canGoNext = index < total - 1 || hasNextPage;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("photos__lightbox__aria_label")}
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-4 py-3 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="type-body-small font-mono opacity-80">
          {t("photos__lightbox__counter", {
            current: index + 1,
            total,
          })}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={update.isPending}
            aria-label={
              favorited
                ? t("photos__detail__favourited")
                : t("photos__detail__favourite")
            }
            className="hover:bg-white/10 flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors disabled:opacity-50"
          >
            <Heart
              width={16}
              height={16}
              className={favorited ? "fill-destructive text-destructive" : ""}
            />
          </button>
          {fullUrl && (
            <button
              type="button"
              onClick={handleDownload}
              aria-label={t("photos__detail__download")}
              className="hover:bg-white/10 flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors"
            >
              <Download width={16} height={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={t("photos__lightbox__close")}
            className="hover:bg-white/10 flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors"
          >
            <XIcon width={16} height={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {fullUrl ? (
          <img
            src={fullUrl}
            alt={photo.name}
            className="max-h-full max-w-full touch-none object-contain select-none"
            draggable={false}
          />
        ) : (
          <div
            className="rounded-16 flex size-72 items-center justify-center"
            style={{
              background: `linear-gradient(160deg, ${photo.tint}, ${photo.tint}bb)`,
            }}
          >
            <span className="font-serif text-6xl text-black/40">
              {photo.monogram}
            </span>
          </div>
        )}

        {canGoPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label={t("photos__lightbox__prev")}
            className="absolute left-4 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <ChevronLeft width={18} height={18} />
          </button>
        )}
        {canGoNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label={t("photos__lightbox__next")}
            className="absolute right-4 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <ChevronRight width={18} height={18} />
          </button>
        )}
      </div>

      <div
        className="flex flex-col gap-2 px-5 pt-2 pb-3 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="type-body-small font-serif font-semibold">
              {photo.name}
            </p>
            <p className="type-caption opacity-70">{photo.time}</p>
          </div>
          {isFetchingNextPage && (
            <span className="type-caption opacity-70">
              {t("photos__lightbox__loading_more")}
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-2 overflow-x-auto px-[50%] py-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {photos.map((p, i) => {
            const isActive = i === index;
            return (
              <button
                key={p.id}
                ref={isActive ? activeThumbRef : null}
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "rounded-8 relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden transition-all",
                  isActive
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black/90"
                    : "opacity-60 hover:opacity-100",
                )}
              >
                {p.thumbUrl ? (
                  <img
                    src={p.thumbUrl}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : (
                  <div
                    className="size-full"
                    style={{
                      background: `linear-gradient(160deg, ${p.tint}, ${p.tint}bb)`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
