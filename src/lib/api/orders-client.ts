import { clientFetch, clientFetchPaginated } from "./client";
import type { Order, OrderDetail } from "./types";

export type OrdersListQuery = {
  eventId?: string;
  orderType?: "plan" | "keepsake";
  cursor?: string;
  limit?: number;
};

export const ordersClient = {
  list: (query: OrdersListQuery = {}) =>
    clientFetchPaginated<Order>("/payments/orders", { query }),

  get: (orderId: string) =>
    clientFetch<{ order: OrderDetail }>(`/payments/orders/${orderId}`),

  refund: (orderId: string, input: { amountCents?: number; reason?: string }) =>
    clientFetch<{ order: Order }>(`/payments/orders/${orderId}/refund`, {
      method: "POST",
      body: input,
    }),
};
