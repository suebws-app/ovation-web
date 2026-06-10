"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { useInfiniteGallery } from "@/lib/query/galleryQueries";
import { MediaPickerTile } from "./MediaPickerTile";
import { MediaPreviewDialog } from "./MediaPreviewDialog";
import { PickerSkeleton } from "./PickerSkeleton";
import { SourceFilterTabs, type SourceFilter } from "./SourceFilterTabs";
import type { GalleryItem } from "@/lib/api/types";

type MediaPickerProps = {
  eventId: string | null;
  type: "photo" | "video" | "all";
  selectedIds: string[];
  onToggle: (id: string) => void;
  emptyHint: string;
};

const PAGE_SIZE = 20;
const NEXT_PAGE_SKELETON_COUNT = 6;

export const MediaPicker = ({
  eventId,
  type,
  selectedIds,
  onToggle,
  emptyHint,
}: MediaPickerProps) => {
  const [source, setSource] = useState<SourceFilter>("all");
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [maxHeightPx, setMaxHeightPx] = useState<number>(320);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error: queryError,
    isPlaceholderData,
  } = useInfiniteGallery(eventId ?? "", {
    type,
    filter: source,
    limit: PAGE_SIZE,
    sort: "newest",
  });

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { root: scrollRef.current, rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const compute = () => {
      const cols = window
        .getComputedStyle(grid)
        .gridTemplateColumns.split(" ")
        .filter(Boolean).length;
      if (cols === 0) return;
      const gapPx = parseFloat(window.getComputedStyle(grid).rowGap) || 0;
      const gridWidth = grid.clientWidth;
      const tileWidth = (gridWidth - (cols - 1) * gapPx) / cols;
      const rows = 4;
      const height = Math.round(tileWidth * rows + (rows - 1) * gapPx);
      setMaxHeightPx(height);
    };
    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [items.length]);

  if (!eventId) return null;

  const errorMessage = queryError
    ? ApiError.isApiError(queryError)
      ? queryError.message
      : "Could not load media"
    : null;

  const showInitialSkeleton = isLoading;
  const showRefreshing =
    !isLoading && (isFetching || isPlaceholderData) && !isFetchingNextPage;
  const showEmpty = !isLoading && !errorMessage && items.length === 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SourceFilterTabs value={source} onChange={setSource} />
        {showRefreshing && (
          <span
            className="type-caption text-muted-foreground tracking-wider"
            role="status"
          >
            Updating…
          </span>
        )}
      </div>
      {errorMessage && (
        <p className="type-body-small text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
      <div
        ref={scrollRef}
        className="overflow-y-auto"
        style={{ maxHeight: maxHeightPx, minHeight: maxHeightPx }}
      >
        {showInitialSkeleton && <PickerSkeleton variant="tiles" count={12} />}
        {showEmpty && (
          <div className="flex h-full items-center justify-center p-6">
            <p className="type-body-small text-muted-foreground text-center">
              {emptyHint}
            </p>
          </div>
        )}
        {items.length > 0 && (
          <>
          <div
            ref={gridRef}
            key={source}
            className={`mobile:grid-cols-3 tablet:grid-cols-4 desktop:grid-cols-5 grid grid-cols-2 gap-2 transition-opacity ${
              showRefreshing ? "opacity-60" : "opacity-100"
            }`}
          >
            {items.map((item, i) => (
              <MediaPickerTile
                key={item.id}
                item={item}
                index={i}
                selected={selectedIds.includes(item.id)}
                onToggle={onToggle}
                onPreview={setPreviewItem}
              />
            ))}
            {isFetchingNextPage &&
              Array.from({ length: NEXT_PAGE_SKELETON_COUNT }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="rounded-12 bg-muted aspect-square animate-pulse"
                />
              ))}
          </div>
          {hasNextPage && !isLoading && (
            <div
              ref={sentinelRef}
              className="flex h-10 items-center justify-center"
              aria-live="polite"
              aria-busy={isFetchingNextPage}
            >
              {isFetchingNextPage && (
                <span className="border-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />
              )}
            </div>
          )}
          </>
        )}
      </div>
      <MediaPreviewDialog
        item={previewItem}
        onOpenChange={(open) => {
          if (!open) setPreviewItem(null);
        }}
      />
    </div>
  );
};
