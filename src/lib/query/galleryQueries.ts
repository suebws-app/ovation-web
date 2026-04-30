"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaClient } from "@/lib/api/messages-client";
import { queryKeys } from "./keys";

type GalleryFilter = {
  type?: "photo" | "video" | "all";
  limit?: number;
};

export const useInfiniteGallery = (eventId: string, input: GalleryFilter = {}) =>
  useInfiniteQuery({
    queryKey: queryKeys.gallery.infiniteList(eventId, input),
    queryFn: ({ pageParam }) =>
      mediaClient.gallery(eventId, {
        type: input.type,
        limit: input.limit,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? null,
    enabled: Boolean(eventId),
  });

export const useDeleteMedia = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (mediaId) => mediaClient.remove(eventId, mediaId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.gallery.all(eventId) });
      qc.invalidateQueries({ queryKey: queryKeys.events.stats(eventId) });
    },
  });
};

type UpdateMediaInput = {
  mediaId: string;
  patch: { isFavorite?: boolean; isGoldBookSelected?: boolean };
};

export const useUpdateMedia = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation<
    {
      media: { id: string; isFavorite: boolean; isGoldBookSelected: boolean };
    },
    Error,
    UpdateMediaInput
  >({
    mutationFn: ({ mediaId, patch }) =>
      mediaClient.update(eventId, mediaId, patch),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.gallery.all(eventId) });
    },
  });
};
