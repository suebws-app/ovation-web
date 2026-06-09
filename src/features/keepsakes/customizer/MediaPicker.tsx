"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { useInfiniteGallery } from "@/lib/query/galleryQueries";
import { Button } from "@ovation/ui/components/Button";
import { MediaPickerTile } from "./MediaPickerTile";
import { MediaPreviewDialog } from "./MediaPreviewDialog";
import { PickerSkeleton } from "./PickerSkeleton";
import { SourceFilterTabs, type SourceFilter } from "./SourceFilterTabs";
import { usePhotoUpload } from "@/features/photos/hooks/usePhotoUpload";
import type { GalleryItem } from "@/lib/api/types";

type MediaPickerProps = {
  eventId: string | null;
  type: "photo" | "video" | "all";
  selectedIds: string[];
  onToggle: (id: string) => void;
  emptyHint: string;
};

const PAGE_SIZE = 10;
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    upload,
    isUploading,
    error: uploadError,
  } = usePhotoUpload(eventId ?? "");

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
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!eventId) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    await upload(Array.from(files));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const acceptTypes =
    type === "video"
      ? "video/*"
      : type === "photo"
        ? "image/*"
        : "image/*,video/*";

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
        <div className="flex items-center gap-2">
          {showRefreshing && !isUploading && (
            <span
              className="type-caption text-muted-foreground tracking-wider"
              role="status"
            >
              Updating…
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptTypes}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full"
          >
            {isUploading ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </div>
      {(errorMessage || uploadError) && (
        <p className="type-body-small text-destructive" role="alert">
          {errorMessage ?? uploadError}
        </p>
      )}
      {showInitialSkeleton && <PickerSkeleton variant="tiles" count={12} />}
      {showEmpty && (
        <p className="type-body-small text-muted-foreground">{emptyHint}</p>
      )}
      {items.length > 0 && (
        <div
          className={`mobile:grid-cols-3 tablet:grid-cols-4 desktop:grid-cols-5 grid grid-cols-2 gap-2 transition-opacity ${
            showRefreshing ? "opacity-60" : "opacity-100"
          }`}
        >
          {items.map((item) => (
            <MediaPickerTile
              key={item.id}
              item={item}
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
      )}
      {hasNextPage && !isLoading && (
        <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
      )}
      <MediaPreviewDialog
        item={previewItem}
        onOpenChange={(open) => {
          if (!open) setPreviewItem(null);
        }}
      />
    </div>
  );
};
