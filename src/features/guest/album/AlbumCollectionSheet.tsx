"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@ovation/ui/components/Sheet";
import { XIcon } from "@ovation/icons/XIcon";
import { usePublicInfiniteGallery } from "@/lib/query/publicGalleryQueries";
import { PublicGallerySkeleton } from "@/features/public-gallery/components/PublicGallerySkeleton";
import { PublicGalleryLightbox } from "@/features/public-gallery/components/PublicGalleryLightbox";
import type { GalleryItem } from "@/lib/api/types";
import { AlbumCollectionTile } from "./AlbumCollectionTile";
import type { AlbumCollection } from "./albumScope";

type AlbumCollectionSheetProps = {
  slug: string;
  collection: AlbumCollection;
  open: boolean;
  onClose: () => void;
  onDelete: (item: GalleryItem) => void;
};

export const AlbumCollectionSheet = ({
  slug,
  collection,
  open,
  onClose,
  onDelete,
}: AlbumCollectionSheetProps) => {
  const t = useTranslations();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePublicInfiniteGallery(
      slug,
      undefined,
      {
        sort: "newest",
        limit: 24,
        mine: collection === "mine",
        liked: collection === "liked",
      },
      { enabled: open },
    );

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const title =
    collection === "liked"
      ? t("guest__album__filter_liked")
      : t("guest__album__filter_mine");
  const emptyCopy =
    collection === "liked"
      ? t("guest__album__liked_empty")
      : t("guest__album__mine_empty");

  const close = () => {
    setLightboxIndex(null);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(next) => !next && close()}>
      <SheetContent
        side="bottom"
        className="rounded-t-24 max-h-[85vh] min-h-[25vh]"
        onInteractOutside={(event) => {
          if (lightboxIndex !== null) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (lightboxIndex !== null) event.preventDefault();
        }}
      >
        <div className="flex max-h-[85vh] min-h-[25vh] flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="type-h3">{title}</SheetTitle>
            <SheetClose
              aria-label={t("common__close")}
              className="text-muted-foreground hover:bg-muted hover:text-foreground -mr-1 flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors"
            >
              <XIcon className="size-4" aria-hidden />
            </SheetClose>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto">
            {isPending && <PublicGallerySkeleton />}
            {!isPending && items.length === 0 && (
              <p className="type-body text-muted-foreground my-auto py-10 text-center">
                {emptyCopy}
              </p>
            )}
            {items.length > 0 && (
              <div className="tablet:grid-cols-4 desktop:grid-cols-6 large-desktop:grid-cols-8 grid grid-cols-3 gap-2">
                {items.map((item, index) => (
                  <AlbumCollectionTile
                    key={item.id}
                    item={item}
                    openLabel={t("guest_gallery__open_preview")}
                    deleteLabel={t("guest__album__delete")}
                    onOpen={() => setLightboxIndex(index)}
                    onDelete={item.isMine ? () => onDelete(item) : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {lightboxIndex !== null && (
          <PublicGalleryLightbox
            items={items}
            index={lightboxIndex}
            slug={slug}
            hasNextPage={Boolean(hasNextPage)}
            isFetchingNextPage={isFetchingNextPage}
            onDelete={onDelete}
            onClose={() => setLightboxIndex(null)}
            onIndexChange={setLightboxIndex}
            onLoadMore={() => void fetchNextPage()}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
