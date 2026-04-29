"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";

import { useInfiniteMessagesList } from "@/lib/query/messagesQueries";
import type { EventStats, MessageSort } from "@/lib/api/types";

import { PhotoBatchFooter } from "./components/PhotoBatchFooter";
import { PhotoGallery } from "./components/PhotoGallery";
import { PhotoLightbox } from "./components/PhotoLightbox";
import { PhotoToolbar } from "./components/PhotoToolbar";
import { PhotosFilterRail } from "./components/PhotosFilterRail";
import { usePhotoBulkActions } from "./hooks/usePhotoBulkActions";
import { toPhotoView, type PhotoView } from "./adapters";
import {
  useLightboxIndex,
  usePhotoSearch,
  usePhotoSelectedIds,
  usePhotoSort,
  usePhotosStore,
  useSubFilter,
  type PhotoSort,
  type PhotoSubFilter,
} from "./store/usePhotosStore";

type PhotosPageClientProps = {
  eventId: string;
  stats: EventStats | null;
};

const PAGE_SIZE = 20;

const applySubFilter = (photos: PhotoView[], filter: PhotoSubFilter) => {
  if (filter === "favorites") return photos.filter((p) => p.favorited);
  return photos;
};

const applyClientSort = (photos: PhotoView[], sort: PhotoSort) => {
  if (sort === "name_asc") {
    return [...photos].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  }
  if (sort === "name_desc") {
    return [...photos].sort((a, b) =>
      b.name.localeCompare(a.name, undefined, { sensitivity: "base" }),
    );
  }
  return photos;
};

const toServerSort = (sort: PhotoSort): MessageSort => {
  if (sort === "oldest") return "oldest";
  return "newest";
};

export const PhotosPageClient = ({
  eventId,
  stats,
}: PhotosPageClientProps) => {
  const t = useTranslations();
  const subFilter = useSubFilter();
  const sort = usePhotoSort();
  const search = usePhotoSearch();
  const selectedIds = usePhotoSelectedIds();
  const lightboxIndex = useLightboxIndex();
  const toggleSelected = usePhotosStore((s) => s.toggleSelected);
  const openLightbox = usePhotosStore((s) => s.openLightbox);
  const closeLightbox = usePhotosStore((s) => s.closeLightbox);
  const setLightboxIndex = usePhotosStore((s) => s.setLightboxIndex);

  const trimmedSearch = search.trim();

  const query = useMemo(
    () => ({
      filter: "with_photo" as const,
      sort: toServerSort(sort),
      limit: PAGE_SIZE,
      includeOwnerUploads: true,
      ...(trimmedSearch ? { search: trimmedSearch } : {}),
    }),
    [sort, trimmedSearch],
  );

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMessagesList(eventId, query);

  const anonymous = t("common__anonymous");
  const allPhotos = useMemo(
    () =>
      (data?.pages ?? []).flatMap((page) =>
        page.items.map((m) => toPhotoView(m, anonymous)),
      ),
    [data?.pages, anonymous],
  );

  const photos = useMemo(() => {
    const filtered = applySubFilter(allPhotos, subFilter);
    return applyClientSort(filtered, sort);
  }, [allPhotos, subFilter, sort]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: scrollRef.current, rootMargin: "400px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleTileClick = (id: string) => {
    const idx = photos.findIndex((p) => p.id === id);
    if (idx >= 0) openLightbox(idx);
  };

  const bulk = usePhotoBulkActions(eventId, photos);

  const totalCount = stats?.photoMessages ?? allPhotos.length;

  return (
    <div className="flex h-full w-full flex-1 overflow-auto">
      <div
        ref={scrollRef}
        className="bg-card relative flex h-full min-h-0 w-full flex-1 flex-col overflow-y-auto"
      >
        <PhotoToolbar eventId={eventId} totalCount={totalCount} />
      <PhotosFilterRail photos={photos} stats={stats} />
      {isPending ? (
        <p className="type-body-small text-muted-foreground p-8 text-center">
          {t("photos__loading")}
        </p>
      ) : isError ? (
        <p className="type-body-small text-destructive p-8 text-center">
          {t("photos__error")}
        </p>
      ) : (
        <>
          <PhotoGallery
            photos={photos}
            selectedIds={selectedIds}
            onTileClick={handleTileClick}
            onToggleSelect={toggleSelected}
          />
          <div ref={sentinelRef} aria-hidden className="h-px" />
          {isFetchingNextPage && (
            <p className="type-caption text-muted-foreground p-4 text-center">
              {t("photos__lightbox__loading_more")}
            </p>
          )}
        </>
      )}

      <PhotoBatchFooter
        count={bulk.selectedCount}
        allFavorited={bulk.allFavorited}
        bulkPending={bulk.isPending}
        onBulkFavorite={bulk.bulkFavorite}
        onBulkDownload={bulk.bulkDownload}
      />

        {lightboxIndex !== null && photos[lightboxIndex] && (
          <PhotoLightbox
            eventId={eventId}
            photos={photos}
            index={lightboxIndex}
            hasNextPage={Boolean(hasNextPage)}
            isFetchingNextPage={isFetchingNextPage}
            onClose={closeLightbox}
            onIndexChange={setLightboxIndex}
            onLoadMore={() => {
              if (!isFetchingNextPage) fetchNextPage();
            }}
          />
        )}
      </div>
    </div>
  );
};
