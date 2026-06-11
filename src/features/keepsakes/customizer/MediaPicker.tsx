"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import { ApiError } from "@/lib/api/client";
import {
  useGalleryCount,
  useInfiniteGallery,
} from "@/lib/query/galleryQueries";
import { MediaPickerTile } from "./MediaPickerTile";
import { MediaPreviewDialog } from "./MediaPreviewDialog";
import { PickerSkeleton } from "./PickerSkeleton";
import { SourceFilterTabs, type SourceFilter } from "./SourceFilterTabs";
import type { GalleryItem, PhotoSelectAll } from "@/lib/api/types";

type MediaPickerProps = {
  eventId: string | null;
  type: "photo" | "video" | "all";
  selectedIds: string[];
  onToggle: (id: string) => void;
  onChange?: (nextIds: string[]) => void;
  selectAll: PhotoSelectAll | null;
  onSelectAllChange: (next: PhotoSelectAll | null) => void;
  emptyHint: string;
};

const PAGE_SIZE = 20;
const NEXT_PAGE_SKELETON_COUNT = 6;

const itemMatchesFilter = (
  item: GalleryItem,
  filter: PhotoSelectAll["filter"],
): boolean => {
  switch (filter) {
    case "favorites":
      return item.isFavorite;
    case "gold_book":
      return item.isGoldBookSelected;
    case "all":
    default:
      return true;
  }
};

export const MediaPicker = ({
  eventId,
  type,
  selectedIds,
  onToggle,
  onChange,
  selectAll,
  onSelectAllChange,
  emptyHint,
}: MediaPickerProps) => {
  const t = useTranslations();
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

  const countQuery = useGalleryCount(eventId ?? "", {
    type,
    filter: selectAll?.filter ?? "all",
  });

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

  const selectAllActive = selectAll !== null;
  const effectiveCount = selectAllActive
    ? Math.max(0, (countQuery.data?.count ?? 0) - selectAll.excludedIds.length)
    : selectedIds.length;

  const isItemSelected = (item: GalleryItem): boolean => {
    if (selectAllActive) {
      if (!itemMatchesFilter(item, selectAll.filter)) return false;
      return !selectAll.excludedIds.includes(item.id);
    }
    return selectedIds.includes(item.id);
  };

  const handleTileToggle = (id: string) => {
    if (!selectAllActive) {
      onToggle(id);
      return;
    }
    const item = items.find((it) => it.id === id);
    if (!item) return;
    if (!itemMatchesFilter(item, selectAll.filter)) return;
    const excluded = new Set(selectAll.excludedIds);
    if (excluded.has(id)) excluded.delete(id);
    else excluded.add(id);
    onSelectAllChange({
      filter: selectAll.filter,
      excludedIds: Array.from(excluded),
    });
  };

  const handleSelectAllToggle = () => {
    if (selectAllActive) {
      onSelectAllChange(null);
      onChange?.([]);
      return;
    }
    onSelectAllChange({ filter: source, excludedIds: [] });
    onChange?.([]);
  };

  const showScopeNote =
    selectAllActive && selectAll.filter !== source;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SourceFilterTabs value={source} onChange={setSource} />
        <div className="flex flex-wrap items-center gap-2">
          {showRefreshing && (
            <span
              className="type-caption text-muted-foreground tracking-wider"
              role="status"
            >
              Updating…
            </span>
          )}
          {selectAllActive && (
            <span
              className="type-caption text-muted-foreground tracking-wider"
              role="status"
            >
              {t("keepsakes__book_customizer__photos_count_of", {
                selected: effectiveCount,
                total: countQuery.data?.count ?? 0,
              })}
            </span>
          )}
          {items.length > 0 && (
            <label className="type-caption text-foreground flex cursor-pointer items-center gap-2 font-semibold">
              <Checkbox
                checked={selectAllActive}
                onChange={handleSelectAllToggle}
                aria-label={t("keepsakes__book_customizer__photos_select_all")}
              />
              {t("keepsakes__book_customizer__photos_select_all")}
            </label>
          )}
        </div>
      </div>
      {showScopeNote && (
        <p className="type-caption text-muted-foreground">
          {t("keepsakes__book_customizer__photos_scope_note", {
            filter: t(
              selectAll.filter === "favorites"
                ? "keepsakes__book_customizer__photos_filter_favorites"
                : selectAll.filter === "gold_book"
                  ? "keepsakes__book_customizer__photos_filter_gold_book"
                  : "keepsakes__book_customizer__photos_filter_all",
            ),
          })}
        </p>
      )}
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
              {(() => {
                let selectAllCounter = 0;
                return items.map((item, i) => {
                  const selected = isItemSelected(item);
                  let order: number | null = null;
                  if (selectAllActive) {
                    if (selected) {
                      selectAllCounter += 1;
                      order = selectAllCounter;
                    }
                  } else {
                    const idx = selectedIds.indexOf(item.id);
                    order = idx >= 0 ? idx + 1 : null;
                  }
                  return (
                    <MediaPickerTile
                      key={item.id}
                      item={item}
                      index={i}
                      selected={selected}
                      selectionOrder={order}
                      onToggle={handleTileToggle}
                      onPreview={setPreviewItem}
                    />
                  );
                });
              })()}
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
