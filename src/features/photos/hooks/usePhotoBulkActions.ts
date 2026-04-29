"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpdateMessage } from "@/lib/query/messagesQueries";
import { queryKeys } from "@/lib/query/keys";
import { messagesClient } from "@/lib/api/messages-client";
import { downloadPhotosFlat } from "@/lib/media/downloadMessageAssets";
import type { MessageDetail } from "@/lib/api/types";
import { usePhotoSelectedIds } from "../store/usePhotosStore";
import type { PhotoView } from "../adapters";

type BulkInput =
  | { kind: "favorite"; ids: string[]; nextValue: boolean }
  | { kind: "download"; ids: string[] };

export const usePhotoBulkActions = (
  eventId: string,
  photos: PhotoView[],
) => {
  const qc = useQueryClient();
  const selectedIds = usePhotoSelectedIds();
  const updateMessage = useUpdateMessage(eventId);
  const t = useTranslations();
  const anonymous = t("common__anonymous");

  const selectedViews = useMemo(
    () => photos.filter((p) => selectedIds.has(p.id)),
    [photos, selectedIds],
  );

  const allFavorited =
    selectedViews.length > 0 && selectedViews.every((p) => p.favorited);

  const mutation = useMutation({
    mutationFn: async (input: BulkInput) => {
      if (input.kind === "favorite") {
        await Promise.all(
          input.ids.map((id) =>
            updateMessage.mutateAsync({
              messageId: id,
              input: { isFavorite: input.nextValue },
            }),
          ),
        );
        return;
      }
      const inputs = await Promise.all(
        input.ids.map(async (id) => {
          const detailKey = queryKeys.messages.detail(eventId, id);
          const cached =
            qc.getQueryData<{ message: MessageDetail }>(detailKey) ??
            (await qc.fetchQuery<{ message: MessageDetail }>({
              queryKey: detailKey,
              queryFn: () => messagesClient.get(eventId, id),
            }));
          return {
            guestName: cached.message.guestNames || anonymous,
            photoUrl: cached.message.photoUrl,
            createdAt: cached.message.createdAt,
          };
        }),
      );
      const photoInputs = inputs.flatMap((i) =>
        i.photoUrl
          ? [{ guestName: i.guestName, photoUrl: i.photoUrl, createdAt: i.createdAt }]
          : [],
      );
      await downloadPhotosFlat(photoInputs, "photos");
    },
  });

  const ids = Array.from(selectedIds);

  return {
    bulkFavorite: () =>
      mutation.mutate({ kind: "favorite", ids, nextValue: !allFavorited }),
    bulkDownload: () => mutation.mutate({ kind: "download", ids }),
    isPending: mutation.isPending,
    allFavorited,
    selectedCount: selectedIds.size,
  };
};
