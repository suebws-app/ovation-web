"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { useUpdateMedia } from "@/lib/query/galleryQueries";
import { downloadPhotosFlat } from "@/lib/media/downloadMessageAssets";
import { usePhotoSelectedIds } from "../store/usePhotosStore";
import type { PhotoView } from "../adapters";

type BulkInput =
  | { kind: "favorite"; views: PhotoView[]; nextValue: boolean }
  | { kind: "gold_book"; views: PhotoView[]; nextValue: boolean }
  | { kind: "download"; views: PhotoView[] };

export const usePhotoBulkActions = (
  eventId: string,
  photos: PhotoView[],
) => {
  const selectedIds = usePhotoSelectedIds();
  const updateMedia = useUpdateMedia(eventId);
  const t = useTranslations();
  const anonymous = t("common__anonymous");

  const selectedViews = useMemo(
    () => photos.filter((p) => selectedIds.has(p.id)),
    [photos, selectedIds],
  );

  const allFavorited =
    selectedViews.length > 0 && selectedViews.every((p) => p.favorited);
  const allInGoldBook =
    selectedViews.length > 0 && selectedViews.every((p) => p.inGoldBook);

  const mutation = useMutation({
    mutationFn: async (input: BulkInput) => {
      if (input.kind === "favorite") {
        await Promise.all(
          input.views.map((v) =>
            updateMedia.mutateAsync({
              mediaId: v.mediaId,
              patch: { isFavorite: input.nextValue },
            }),
          ),
        );
        return;
      }
      if (input.kind === "gold_book") {
        await Promise.all(
          input.views.map((v) =>
            updateMedia.mutateAsync({
              mediaId: v.mediaId,
              patch: { isGoldBookSelected: input.nextValue },
            }),
          ),
        );
        return;
      }
      const photoInputs = input.views
        .filter((v) => v.fullUrl || v.thumbUrl)
        .map((v) => ({
          guestName: v.name || anonymous,
          photoUrl: (v.fullUrl ?? v.thumbUrl) as string,
          createdAt: v.createdAt,
        }));
      await downloadPhotosFlat(photoInputs, "photos");
    },
  });

  return {
    bulkFavorite: () =>
      mutation.mutate({ kind: "favorite", views: selectedViews, nextValue: !allFavorited }),
    bulkGoldBook: () =>
      mutation.mutate({
        kind: "gold_book",
        views: selectedViews,
        nextValue: !allInGoldBook,
      }),
    bulkDownload: () => mutation.mutate({ kind: "download", views: selectedViews }),
    isPending: mutation.isPending,
    allFavorited,
    allInGoldBook,
    selectedCount: selectedIds.size,
  };
};
