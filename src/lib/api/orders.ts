import { apiFetch, apiFetchPaginated } from "./server";
import type { Order, OrderDetail, OrderSession } from "./types";

export const ordersApi = {
  list: (
    query: {
      eventId?: string;
      orderType?: "plan" | "keepsake";
      cursor?: string;
      limit?: number;
    } = {},
  ) => apiFetchPaginated<Order>("/payments/orders", { query }),

  get: (orderId: string) =>
    apiFetch<{ order: OrderDetail; session: OrderSession }>(
      `/payments/orders/${orderId}`,
    ),
};

export const planPurchasesApi = {
  get: (id: string) =>
    apiFetch<{ purchase: { id: string; status: string; planCode: string } }>(
      `/payments/plan-purchases/${id}`,
    ),
};
