"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { publicClient } from "@/lib/api/public-client";
import { queryKeys } from "./keys";

type PublicGalleryFilter = {
  type?: "photo" | "video" | "all";
  sort?: "newest" | "oldest";
  limit?: number;
};

export const usePublicInfiniteGallery = (
  slug: string,
  code: string,
  input: PublicGalleryFilter = {},
) =>
  useInfiniteQuery({
    queryKey: queryKeys.publicGallery.infiniteList(slug, code, input),
    queryFn: ({ pageParam }) =>
      publicClient.getGallery(slug, code, {
        type: input.type,
        sort: input.sort,
        limit: input.limit,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? null,
    enabled: Boolean(slug && code),
    staleTime: 30_000,
    retry: false,
  });
