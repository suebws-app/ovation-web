"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { publicClient } from "@/lib/api/public-client";
import { queryKeys } from "./keys";

type PublicGalleryFilter = {
  type?: "photo" | "video" | "all";
  sort?: "newest" | "oldest";
  limit?: number;
};

type PublicGalleryOptions = {
  /** Poll the first page on an interval — used by the live demo wall. */
  refetchInterval?: number;
  enabled?: boolean;
};

export const usePublicInfiniteGallery = (
  slug: string,
  code: string | undefined,
  input: PublicGalleryFilter = {},
  options: PublicGalleryOptions = {},
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
    enabled: Boolean(slug) && options.enabled !== false,
    retry: false,
    refetchInterval: options.refetchInterval,
    refetchIntervalInBackground: false,
  });

export const usePublicGalleryCount = (slug: string, code?: string) =>
  useQuery({
    queryKey: queryKeys.publicGallery.count(slug, code),
    queryFn: () => publicClient.getGalleryCount(slug, code),
    enabled: Boolean(slug),
    retry: false,
  });
