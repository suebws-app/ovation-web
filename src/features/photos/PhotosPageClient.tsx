"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { FeaturePageLayout } from "@/components/FeaturePageLayout";
import { InfiniteScrollSentinel } from "@/components/InfiniteScrollSentinel";
import {
  useGalleryCount,
  useInfiniteGallery,
} from "@/lib/query/galleryQueries";
import type { EventStats } from "@/lib/api/types";

import { PhotoBatchFooter } from "./components/PhotoBatchFooter";
import { PhotoGallerySkeleton } from "./skeletons/PhotoGallerySkeleton";
import { PhotoGallery } from "./components/PhotoGallery";
import { PhotoLightbox } from "./components/PhotoLightbox";
import { PhotosDirectoryEmpty } from "./components/PhotosDirectoryEmpty";
import { PhotosFilterRail } from "./components/PhotosFilterRail";
import { usePhotoBulkActions } from "./hooks/usePhotoBulkActions";
import { toPhotoViewFromGallery } from "./adapters";
import {
  useLightboxIndex,
  usePhotoSearch,
  usePhotoSelectAll,
  usePhotoSelectedIds,
  usePhotoSort,
  usePhotosStore,
  useSubFilter,
} from "./store/usePhotosStore";

type PhotosPageClientProps = {
  eventId: string;
  stats: EventStats | null;
};

const PAGE_SIZE = 20;

export const PhotosPageClient = ({ eventId, stats }: PhotosPageClientProps) => {
  const t = useTranslations();
  const subFilter = useSubFilter();
  const sort = usePhotoSort();
  const search = usePhotoSearch();
  const selectedIds = usePhotoSelectedIds();
  const selectAll = usePhotoSelectAll();
  const lightboxIndex = useLightboxIndex();
  const toggleSelected = usePhotosStore((s) => s.toggleSelected);
  const setSelectAll = usePhotosStore((s) => s.setSelectAll);
  const openLightbox = usePhotosStore((s) => s.openLightbox);
  const closeLightbox = usePhotosStore((s) => s.closeLightbox);
  const setLightboxIndex = usePhotosStore((s) => s.setLightboxIndex);

  const trimmedSearch = search.trim();

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGallery(eventId, {
    type: "all",
    filter: subFilter,
    sort,
    search: trimmedSearch || undefined,
    limit: PAGE_SIZE,
  });

  const allCountQuery = useGalleryCount(eventId, {
    type: "all",
    filter: "all",
    search: trimmedSearch || undefined,
  });

  const anonymous = t("common__anonymous");
  const photos = useMemo(
    () =>
      (data?.pages ?? []).flatMap((page) =>
        page.items.map((m) => toPhotoViewFromGallery(m, anonymous)),
      ),
    [data?.pages, anonymous],
  );

  const allCount = allCountQuery.data?.count ?? 0;

  const handleTileClick = (id: string) => {
    const idx = photos.findIndex((p) => p.id === id);
    if (idx >= 0) openLightbox(idx);
  };

  const isSelected = (id: string): boolean => {
    if (selectAll) return !selectAll.excludedIds.includes(id);
    return selectedIds.has(id);
  };

  const handleToggleSelect = (id: string) => {
    if (!selectAll) {
      toggleSelected(id);
      return;
    }
    const excluded = new Set(selectAll.excludedIds);
    if (excluded.has(id)) excluded.delete(id);
    else excluded.add(id);
    setSelectAll({ ...selectAll, excludedIds: [...excluded] });
  };

  const bulk = usePhotoBulkActions(eventId, photos);

  const lightbox =
    lightboxIndex !== null && photos[lightboxIndex] ? (
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
    ) : null;

  const hasNoPhotosEver = stats?.photoCount === 0;

  return (
    <FeaturePageLayout
      batchFooter={
        <PhotoBatchFooter
          count={bulk.selectedCount}
          allFavorited={bulk.allFavorited}
          allInGoldBook={bulk.allInGoldBook}
          bulkPending={bulk.isPending}
          onBulkFavorite={bulk.bulkFavorite}
          onBulkGoldBook={bulk.bulkGoldBook}
          onBulkDownload={bulk.bulkDownload}
        />
      }
      overlay={lightbox}
    >
      {hasNoPhotosEver ? (
        <PhotosDirectoryEmpty eventId={eventId} />
      ) : (
        <>
          <PhotosFilterRail
            eventId={eventId}
            stats={stats}
            allCount={allCount}
          />
          {isPending ? (
            <PhotoGallerySkeleton />
          ) : isError ? (
            <p className="type-body-small text-destructive p-8 text-center">
              {t("photos__error")}
            </p>
          ) : (
            <>
              <PhotoGallery
                photos={photos}
                isSelected={isSelected}
                onTileClick={handleTileClick}
                onToggleSelect={handleToggleSelect}
              />
              <InfiniteScrollSentinel
                hasNextPage={Boolean(hasNextPage)}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                loadingLabel={t("photos__lightbox__loading_more")}
              />
            </>
          )}
        </>
      )}
    </FeaturePageLayout>
  );
};
