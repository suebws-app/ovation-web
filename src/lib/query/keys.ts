import type { AnalyticsRange, ListMessagesQuery } from "@/lib/api/types";

export const queryKeys = {
  analytics: {
    all: () => ["analytics"] as const,
    me: (range: AnalyticsRange) => ["analytics", "me", range] as const,
  },
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
    count: (
      eventId: string,
      input: { filter?: string; search?: string } = {},
    ) => ["messages", eventId, "count", input] as const,
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
        includeOwnerUploads?: boolean;
      } = {},
    ) => ["gallery", eventId, "infinite", input] as const,
    count: (
      eventId: string,
      input: {
        type?: "photo" | "video" | "all";
        filter?: "all" | "favorites" | "gold_book";
        search?: string;
        includeOwnerUploads?: boolean;
      } = {},
    ) => ["gallery", eventId, "count", input] as const,
  },
  publicGallery: {
    all: (slug: string) => ["public-gallery", slug] as const,
    infiniteList: (
      slug: string,
      code: string,
      input: {
        type?: "photo" | "video" | "all";
        sort?: "newest" | "oldest";
        limit?: number;
      } = {},
    ) => ["public-gallery", slug, code, "infinite", input] as const,
  },
  guests: {
    all: (eventId: string) => ["guests", eventId] as const,
    count: (
      eventId: string,
      input: { filter?: string; search?: string } = {},
    ) => ["guests", eventId, "count", input] as const,
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
  shipping: {
    all: () => ["shipping"] as const,
    countries: (variantIds: string[]) =>
      ["shipping", "countries", [...variantIds].sort()] as const,
    quote: (input: {
      countryCode: string;
      state?: string;
      currency: string;
      items: { variantId: string; quantity: number; numberOfPages: number }[];
    }) => ["shipping", "quote", input] as const,
  },
  currencies: {
    supported: () => ["currencies", "supported"] as const,
  },
} as const;
