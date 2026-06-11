import type { ListMessagesQuery } from "@/lib/api/types";

export const queryKeys = {
  events: {
    all: () => ["events"] as const,
    list: (input?: { limit?: number; cursor?: string }) =>
      ["events", "list", input ?? {}] as const,
    detail: (eventId: string) => ["events", "detail", eventId] as const,
    stats: (eventId: string) => ["events", "stats", eventId] as const,
  },
  messages: {
    all: (eventId: string) => ["messages", eventId] as const,
    lists: (eventId: string) => ["messages", eventId, "list"] as const,
    list: (eventId: string, input: ListMessagesQuery = {}) =>
      ["messages", eventId, "list", input] as const,
    infiniteList: (
      eventId: string,
      input: Omit<ListMessagesQuery, "cursor"> = {},
    ) => ["messages", eventId, "list", "infinite", input] as const,
    detail: (eventId: string, messageId: string) =>
      ["messages", eventId, "detail", messageId] as const,
  },
  gallery: {
    all: (eventId: string) => ["gallery", eventId] as const,
    infiniteList: (
      eventId: string,
      input: {
        type?: "photo" | "video" | "all";
        filter?: "all" | "favorites" | "gold_book";
        sort?: "newest" | "oldest";
        search?: string;
        limit?: number;
      } = {},
    ) => ["gallery", eventId, "infinite", input] as const,
    count: (
      eventId: string,
      input: {
        type?: "photo" | "video" | "all";
        filter?: "all" | "favorites" | "gold_book";
      } = {},
    ) => ["gallery", eventId, "count", input] as const,
  },
  user: {
    me: () => ["user", "me"] as const,
  },
  orders: {
    all: () => ["orders"] as const,
    list: (
      filters: { eventId?: string; orderType?: "plan" | "keepsake" } = {},
    ) => ["orders", "list", filters] as const,
    detail: (orderId: string) => ["orders", "detail", orderId] as const,
  },
  pdf: {
    all: () => ["pdf"] as const,
    render: (renderId: string) => ["pdf", "render", renderId] as const,
  },
} as const;
