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
    detail: (eventId: string, messageId: string) =>
      ["messages", eventId, "detail", messageId] as const,
  },
  user: {
    me: () => ["user", "me"] as const,
  },
  orders: {
    all: () => ["orders"] as const,
    detail: (orderId: string) => ["orders", "detail", orderId] as const,
  },
} as const;
