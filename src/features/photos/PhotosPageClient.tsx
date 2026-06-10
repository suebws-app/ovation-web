"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { FeaturePageLayout } from "@/components/FeaturePageLayout";
import { InfiniteScrollSentinel } from "@/components/InfiniteScrollSentinel";
import { useInfiniteGallery } from "@/lib/query/galleryQueries";
import type { EventStats } from "@/lib/api/types";

import { PhotoBatchFooter } from "./components/PhotoBatchFooter";
import { PhotoGallery } from "./components/PhotoGallery";
import { PhotoLightbox } from "./components/PhotoLightbox";
import { PhotosFilterRail } from "./components/PhotosFilterRail";
import { usePhotoBulkActions } from "./hooks/usePhotoBulkActions";
import { toPhotoViewFromGallery } from "./adapters";
import {
  useLightboxIndex,
  usePhotoSearch,
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
  const lightboxIndex = useLightboxIndex();
  const toggleSelected = usePhotosStore((s) => s.toggleSelected);
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

  const allCountQuery = useInfiniteGallery(eventId, {
    type: "all",
    filter: "all",
    sort,
    search: trimmedSearch || undefined,
    limit: PAGE_SIZE,
  });

  const anonymous = t("common__anonymous");
  const photos = useMemo(
    () =>
      (data?.pages ?? []).flatMap((page) =>
        page.items.map((m) => toPhotoViewFromGallery(m, anonymous)),
      ),
    [data?.pages, anonymous],
  );

  const allLoadedCount = useMemo(
    () =>
      (allCountQuery.data?.pages ?? []).reduce(
        (sum, page) => sum + page.items.length,
        0,
      ),
    [allCountQuery.data?.pages],
  );

  const handleTileClick = (id: string) => {
    const idx = photos.findIndex((p) => p.id === id);
    if (idx >= 0) openLightbox(idx);
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
      <PhotosFilterRail
        eventId={eventId}
        photos={photos}
        stats={stats}
        allCount={allLoadedCount}
      />
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
          <InfiniteScrollSentinel
            hasNextPage={Boolean(hasNextPage)}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={fetchNextPage}
            loadingLabel={t("photos__lightbox__loading_more")}
          />
        </>
      )}
    </FeaturePageLayout>
  );
};
