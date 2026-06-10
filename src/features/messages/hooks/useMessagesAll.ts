"use client";

import { useEffect, useMemo } from "react";
import { useInfiniteMessagesList } from "@/lib/query/messagesQueries";
import type { MessageSummary } from "@/lib/api/types";

const PAGE_LIMIT = 100;

type UseMessagesAllResult = {
  messages: MessageSummary[];
  isPending: boolean;
  isError: boolean;
  isFetchingAll: boolean;
};

export const useMessagesAll = (eventId: string): UseMessagesAllResult => {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMessagesList(eventId, {
    limit: PAGE_LIMIT,
    sort: "newest",
  });

  useEffect(() => {
    if (!isPending && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isPending, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const messages = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.items),
    [data?.pages],
  );

  return {
    messages,
    isPending,
    isError,
    isFetchingAll: hasNextPage || isFetchingNextPage,
  };
};
