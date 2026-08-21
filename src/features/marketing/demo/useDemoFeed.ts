"use client";

import { useMemo } from "react";
import { usePublicInfiniteGallery } from "@/lib/query/publicGalleryQueries";
import { DEMO_FEED_PAGE_SIZE, DEMO_FEED_POLL_MS } from "./constants";

export type DemoFeedItem = {
  id: string;
  url: string;
  isNew: boolean;
};

type UseDemoFeedResult = {
  items: DemoFeedItem[];
  isLoading: boolean;
};

export const useDemoFeed = (
  slug: string | undefined,
  galleryCode: string | undefined,
  active: boolean,
  openedAt: number,
): UseDemoFeedResult => {
  const { data, isLoading } = usePublicInfiniteGallery(
    slug ?? "",
    galleryCode ?? "",
    { type: "photo", sort: "newest", limit: DEMO_FEED_PAGE_SIZE },
    {
      refetchInterval: active ? DEMO_FEED_POLL_MS : undefined,
      enabled: active,
    },
  );

  return useMemo(() => {
    const items = (data?.pages.flatMap((page) => page.items) ?? [])
      .filter((item) => item.thumbUrl ?? item.url)
      .map((item) => ({
        id: item.id,
        url: (item.thumbUrl ?? item.url) as string,
        isNew: Date.parse(item.createdAt) >= openedAt,
      }));

    return { items, isLoading };
  }, [data, isLoading, openedAt]);
};
