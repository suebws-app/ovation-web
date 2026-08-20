"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/Toaster";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";
import {
  usePublicGalleryCount,
  usePublicInfiniteGallery,
} from "@/lib/query/publicGalleryQueries";
import { PublicGallerySkeleton } from "@/features/public-gallery/components/PublicGallerySkeleton";
import {
  useDeleteMyGalleryItem,
  usePinnedGallery,
  useToggleAlbumLike,
} from "@/lib/query/albumSocialQueries";
import type { GalleryItem } from "@/lib/api/types";
import { AlbumCommentsSheet } from "./AlbumCommentsSheet";
import { AlbumHero } from "./AlbumHero";
import { AlbumGrid } from "./AlbumGrid";
import { AlbumCollectionSheet } from "./AlbumCollectionSheet";
import type { AlbumCollection } from "./albumScope";
import { PublicGalleryLightbox } from "@/features/public-gallery/components/PublicGalleryLightbox";

type AlbumClientProps = {
  slug: string;
  title: string;
  initials: string;
  avatarUrl: string | null;
  coverUrl: string | null;
};

const HERO_SLIDE_LIMIT = 6;

export const AlbumClient = ({
  slug,
  title,
  initials,
  avatarUrl,
  coverUrl,
}: AlbumClientProps) => {
  const t = useTranslations();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [commentsMediaId, setCommentsMediaId] = useState<string | null>(null);
  const [collection, setCollection] = useState<AlbumCollection>("mine");
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<GalleryItem | null>(null);

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePublicInfiniteGallery(slug, undefined, {
      sort: "newest",
      limit: 24,
    });
  const countQuery = usePublicGalleryCount(slug);
  const pinnedQuery = usePinnedGallery(slug);
  const toggleLike = useToggleAlbumLike(slug);
  const deleteMine = useDeleteMyGalleryItem(slug);

  const items = useMemo(() => {
    const feed = data?.pages.flatMap((page) => page.items) ?? [];
    return [...(pinnedQuery.data ?? []), ...feed];
  }, [data, pinnedQuery.data]);

  const handleLike = (item: GalleryItem) =>
    toggleLike.mutate({ mediaId: item.id, liked: item.likedByMe });

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteMine.mutate(pendingDelete.id, {
      onSuccess: () => {
        setPendingDelete(null);
        setLightboxIndex(null);
        toast.success(t("guest__album__delete_success"));
      },
      onError: () => {
        setPendingDelete(null);
        toast.error(t("guest__album__delete_error"));
      },
    });
  };

  const slideUrls = useMemo(
    () =>
      items
        .filter((item) => item.type === "photo")
        .slice(0, HERO_SLIDE_LIMIT)
        .map((item) => item.url ?? item.thumbUrl)
        .filter((url): url is string => Boolean(url)),
    [items],
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !isFetchingNextPage) {
        void fetchNextPage();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <AlbumHero
        slug={slug}
        title={title}
        initials={initials}
        avatarUrl={avatarUrl}
        coverUrl={coverUrl}
        slideUrls={slideUrls}
        count={countQuery.data?.count ?? null}
        onOpenCollection={(next) => {
          setCollection(next);
          setCollectionOpen(true);
        }}
      />

      <div className="flex flex-1 flex-col gap-4 p-3">
        {isPending && <PublicGallerySkeleton />}
        {!isPending && items.length === 0 && (
          <p className="type-body text-muted-foreground py-10 text-center">
            {t("guest__album__empty")}
          </p>
        )}
        {items.length > 0 && (
          <AlbumGrid
            items={items}
            onOpen={setLightboxIndex}
            onLike={handleLike}
            onComment={(item) => setCommentsMediaId(item.id)}
          />
        )}
        <div ref={sentinelRef} className="h-4" />
      </div>

      <AlbumCommentsSheet
        slug={slug}
        mediaId={commentsMediaId}
        onClose={() => setCommentsMediaId(null)}
      />

      <AlbumCollectionSheet
        slug={slug}
        collection={collection}
        open={collectionOpen}
        onClose={() => setCollectionOpen(false)}
        onDelete={setPendingDelete}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={t("guest__album__delete_confirm_title")}
        description={t("guest__album__delete_confirm_body")}
        cancelLabel={t("common__cancel")}
        confirmLabel={t("guest__album__delete")}
        confirmTone="destructive"
        isPending={deleteMine.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      {lightboxIndex !== null && (
        <PublicGalleryLightbox
          items={items}
          index={lightboxIndex}
          slug={slug}
          hasNextPage={Boolean(hasNextPage)}
          isFetchingNextPage={isFetchingNextPage}
          onDelete={setPendingDelete}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
          onLoadMore={() => void fetchNextPage()}
        />
      )}
    </div>
  );
};
