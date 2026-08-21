"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { publicClient } from "@/lib/api/public-client";
import { queryKeys } from "./keys";

export const usePinnedGallery = (slug: string, code?: string) =>
  useQuery({
    queryKey: queryKeys.publicGallery.pinned(slug, code),
    queryFn: () => publicClient.getGalleryPinned(slug, code),
    enabled: Boolean(slug),
    retry: false,
  });

export const useAlbumComments = (
  slug: string,
  mediaId: string | null,
  enabled: boolean,
) =>
  useInfiniteQuery({
    queryKey: queryKeys.albumComments.list(slug, mediaId ?? ""),
    queryFn: ({ pageParam }) =>
      publicClient.getGalleryComments(
        slug,
        mediaId ?? "",
        pageParam ?? undefined,
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? null,
    enabled: enabled && Boolean(slug && mediaId),
    retry: false,
  });

export const useToggleAlbumLike = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mediaId, liked }: { mediaId: string; liked: boolean }) =>
      liked
        ? publicClient.unlikeGalleryItem(slug, mediaId)
        : publicClient.likeGalleryItem(slug, mediaId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.publicGallery.all(slug),
      });
    },
  });
};

export const useDeleteMyGalleryItem = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaId: string) =>
      publicClient.deleteOwnGalleryItem(slug, mediaId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.publicGallery.all(slug),
      });
    },
  });
};

export const useCreateAlbumComment = (slug: string, mediaId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { guestName: string; body: string }) =>
      publicClient.createGalleryComment(slug, mediaId ?? "", input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.albumComments.list(slug, mediaId ?? ""),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.publicGallery.all(slug),
      });
    },
  });
};
