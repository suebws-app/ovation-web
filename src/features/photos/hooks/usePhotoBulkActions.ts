"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaClient } from "@/lib/api/media-client";
import { queryKeys } from "@/lib/query/keys";
import { useGalleryCount } from "@/lib/query/galleryQueries";
import { saveBlob } from "@/lib/utils/download-blob";
import { downloadMediaFlat } from "@/lib/media/downloadMessageAssets";
import {
  usePhotoSelectAll,
  usePhotoSelectedIds,
} from "../store/usePhotosStore";
import type { PhotoView } from "../adapters";

type BulkKind = "favorite" | "gold_book" | "download";

export const usePhotoBulkActions = (eventId: string, photos: PhotoView[]) => {
  const selectedIds = usePhotoSelectedIds();
  const selectAll = usePhotoSelectAll();
  const qc = useQueryClient();
  const t = useTranslations();
  const anonymous = t("common__anonymous");

  const selectedViews = useMemo(
    () => photos.filter((p) => selectedIds.has(p.id)),
    [photos, selectedIds],
  );

  const allFavorited =
    !selectAll &&
    selectedViews.length > 0 &&
    selectedViews.every((p) => p.isFavorite);
  const allInGoldBook =
    !selectAll &&
    selectedViews.length > 0 &&
    selectedViews.every((p) => p.isGoldBookSelected);

  const selector = selectAll ? { selectAll } : { ids: Array.from(selectedIds) };

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: queryKeys.gallery.all(eventId) });
    qc.invalidateQueries({ queryKey: queryKeys.events.stats(eventId) });
  };

  const mutation = useMutation({
    mutationFn: async (kind: BulkKind) => {
      if (kind === "favorite") {
        await mediaClient.bulkUpdate(eventId, {
          ...selector,
          action: "favorite",
          value: !allFavorited,
        });
        return;
      }
      if (kind === "gold_book") {
        await mediaClient.bulkUpdate(eventId, {
          ...selector,
          action: "gold_book",
          value: !allInGoldBook,
        });
        return;
      }
      if (selectAll) {
        const blob = await mediaClient.bulkDownload(eventId, selector);
        saveBlob(blob, `photos-${eventId}.zip`);
        return;
      }
      const mediaInputs = selectedViews
        .filter((v) => v.url || v.thumbUrl)
        .map((v) => ({
          guestName: v.name || anonymous,
          mediaUrl: (v.url ?? v.thumbUrl) as string,
          type: v.type,
          createdAt: v.createdAt,
        }));
      await downloadMediaFlat(mediaInputs, "media");
    },
    onSuccess: invalidate,
  });

  const countQuery = useGalleryCount(eventId, {
    type: "all",
    filter: selectAll?.filter,
    search: selectAll?.search,
  });
  const effectiveCount = selectAll
    ? Math.max(0, (countQuery.data?.count ?? 0) - selectAll.excludedIds.length)
    : selectedIds.size;

  return {
    bulkFavorite: () => mutation.mutate("favorite"),
    bulkGoldBook: () => mutation.mutate("gold_book"),
    bulkDownload: () => mutation.mutate("download"),
    isPending: mutation.isPending,
    allFavorited,
    allInGoldBook,
    selectedCount: effectiveCount,
    isAllMode: Boolean(selectAll),
  };
};
