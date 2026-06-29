"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeftIcon } from "@ovation/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@ovation/icons/ChevronRightIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { DownloadIcon } from "@ovation/icons/DownloadIcon";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { PlayIcon } from "@ovation/icons/PlayIcon";
import { PauseIcon } from "@ovation/icons/PauseIcon";
import { MaximizeIcon } from "@ovation/icons/MaximizeIcon";
import { cn } from "@ovation/ui/utils/cn";
import { LazyVideoPlayer } from "@/components/LazyVideoPlayer";
import { formatTimeShort } from "@/features/messages/adapters";
import { safeHttpUrl } from "@/lib/utils/safe-url";
import type { GalleryItem } from "@/lib/api/types";
import { downloadGalleryItem, videoMimeFromUrl } from "../utils/download";

const PREFETCH_THRESHOLD = 3;
const SLIDESHOW_INTERVAL_MS = 4000;

type PublicGalleryLightboxProps = {
  items: GalleryItem[];
  index: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  slideshow?: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  onLoadMore: () => void;
};

export const PublicGalleryLightbox = ({
  items,
  index,
  hasNextPage,
  isFetchingNextPage,
  slideshow = false,
  onClose,
  onIndexChange,
  onLoadMore,
}: PublicGalleryLightboxProps) => {
  const t = useTranslations();
  const total = items.length;
  const item = items[index] ?? null;
  const isVideo = item?.type === "video";
  const fullUrl = item ? safeHttpUrl(item.url ?? item.thumbUrl) : null;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const dragStartX = useRef<number | null>(null);
  const activeThumbRef = useRef<HTMLButtonElement | null>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [displayUrl, setDisplayUrl] = useState<string | null>(fullUrl);
  const [baseUrl, setBaseUrl] = useState<string | null>(fullUrl);
  const [isPlaying, setIsPlaying] = useState(slideshow);
  const [controlsVisible, setControlsVisible] = useState(false);

  const revealControls = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(
      () => setControlsVisible(false),
      2500,
    );
  }, []);

  useEffect(
    () => () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    },
    [],
  );

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      rootRef.current?.requestFullscreen?.().catch(() => {});
    }
  }, []);

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
    if (!slideshow) return;
    rootRef.current?.requestFullscreen?.().catch(() => {});
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    };
  }, [slideshow]);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setTimeout(() => {
      if (index < total - 1) {
        onIndexChange(index + 1);
      } else if (hasNextPage && !isFetchingNextPage) {
        onLoadMore();
      } else {
        onIndexChange(0);
      }
    }, SLIDESHOW_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [
    isPlaying,
    index,
    total,
    hasNextPage,
    isFetchingNextPage,
    onIndexChange,
    onLoadMore,
  ]);

  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index]);

  // Keep the previous image on screen until the next one is fully decoded,
  // so advancing never flashes a blank frame.
  useEffect(() => {
    let active = true;
    const show = () => {
      if (active) setDisplayUrl(fullUrl);
    };
    if (!fullUrl || isVideo) {
      queueMicrotask(show);
      return () => {
        active = false;
      };
    }
    const img = new Image();
    img.onload = show;
    img.onerror = () => {
      if (active) setFailedUrl(fullUrl);
    };
    img.src = fullUrl;
    if (img.complete && img.naturalWidth > 0) queueMicrotask(show);
    return () => {
      active = false;
    };
  }, [fullUrl, isVideo]);

  // Prefetch the upcoming image so the swap is instant during a slideshow.
  useEffect(() => {
    const next = items[index + 1];
    const nextUrl = next ? safeHttpUrl(next.url ?? next.thumbUrl) : null;
    if (nextUrl && next?.type !== "video") {
      const img = new Image();
      img.src = nextUrl;
    }
  }, [items, index]);

  if (!item) return null;

  const caption = item.uploaderName?.trim() || t("guest_gallery__anonymous");

  const handleDownload = async () => {
    if (!fullUrl) return;
    try {
      await downloadGalleryItem(fullUrl, caption, isVideo);
    } catch (err) {
      console.error("[public-lightbox] download failed", err);
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
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("guest_gallery__lightbox__aria_label")}
      onMouseMove={slideshow ? revealControls : undefined}
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-[#1a1a1a]",
        slideshow && !controlsVisible && "cursor-none",
      )}
      onClick={onClose}
    >
      {slideshow && controlsVisible && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label={t("guest_gallery__lightbox__close")}
          className="absolute top-4 right-4 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          <XIcon width={18} height={18} strokeWidth={2} />
        </button>
      )}
      {!slideshow && (
        <div
          className="flex items-center justify-between px-4 py-3 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="type-body-small font-mono opacity-80">
            {t("guest_gallery__lightbox__counter", {
              current: index + 1,
              total,
            })}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={
                isPlaying
                  ? t("guest_gallery__lightbox__pause")
                  : t("guest_gallery__lightbox__play")
              }
              className="flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
            >
              {isPlaying ? (
                <PauseIcon width={16} height={16} />
              ) : (
                <PlayIcon width={16} height={16} />
              )}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={t("guest_gallery__lightbox__fullscreen")}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
            >
              <MaximizeIcon width={16} height={16} />
            </button>
            {fullUrl && (
              <button
                type="button"
                onClick={handleDownload}
                aria-label={t("guest_gallery__lightbox__download")}
                className="flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
              >
                <DownloadIcon width={16} height={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={t("guest_gallery__lightbox__close")}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
            >
              <XIcon width={16} height={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {fullUrl && isVideo ? (
          <div className="flex h-full max-h-full w-full max-w-full items-center justify-center">
            <LazyVideoPlayer
              key={fullUrl}
              src={fullUrl}
              type={videoMimeFromUrl(fullUrl)}
              load="eager"
              preload="metadata"
              className="max-h-full max-w-full"
            />
          </div>
        ) : !fullUrl || failedUrl === fullUrl ? (
          <div className="flex size-72 items-center justify-center text-white/30">
            <ImageIcon width={48} height={48} />
          </div>
        ) : slideshow ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {baseUrl && baseUrl !== displayUrl && (
              <img
                src={baseUrl}
                alt=""
                onTransitionEnd={() => setBaseUrl(displayUrl)}
                className={cn(
                  "absolute inset-0 m-auto max-h-full max-w-full object-contain transition-opacity duration-1000 ease-out",
                  loadedUrl === displayUrl ? "opacity-0" : "opacity-100",
                )}
                draggable={false}
              />
            )}
            {displayUrl && (
              <img
                key={displayUrl}
                src={displayUrl}
                alt={caption}
                onLoad={() => setLoadedUrl(displayUrl)}
                className={cn(
                  "absolute inset-0 m-auto max-h-full max-w-full object-contain transition-opacity duration-1000 ease-out select-none",
                  loadedUrl === displayUrl ? "opacity-100" : "opacity-0",
                )}
                draggable={false}
              />
            )}
          </div>
        ) : (
          <img
            src={displayUrl ?? fullUrl}
            alt={caption}
            onError={() => setFailedUrl(fullUrl)}
            className="max-h-full max-w-full touch-none object-contain select-none"
            draggable={false}
          />
        )}

        {!slideshow && canGoPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label={t("guest_gallery__lightbox__prev")}
            className="absolute left-4 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <ChevronLeftIcon width={18} height={18} />
          </button>
        )}
        {!slideshow && canGoNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label={t("guest_gallery__lightbox__next")}
            className="absolute right-4 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <ChevronRightIcon width={18} height={18} />
          </button>
        )}
      </div>

      {!slideshow && (
        <div
          className="flex flex-col gap-2 px-5 pt-2 pb-3 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="type-body-small font-serif font-semibold">
                {caption}
              </p>
              <p className="type-caption opacity-70">
                {formatTimeShort(item.createdAt)}
              </p>
            </div>
            {isFetchingNextPage && (
              <span className="type-caption opacity-70">
                {t("guest_gallery__lightbox__loading_more")}
              </span>
            )}
          </div>

          <div
            className="flex items-center gap-2 overflow-x-auto px-[50%] py-2 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {items.map((thumb, i) => (
              <button
                key={thumb.id}
                ref={i === index ? activeThumbRef : null}
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={t("guest_gallery__lightbox__show_image", {
                  number: i + 1,
                })}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "rounded-8 relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden bg-white/10 transition-all",
                  i === index
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black/90"
                    : "opacity-60 hover:opacity-100",
                )}
              >
                {thumb.thumbUrl && (
                  <img
                    src={thumb.thumbUrl}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
