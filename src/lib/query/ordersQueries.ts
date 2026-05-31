"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ordersClient } from "@/lib/api/orders-client";
import { queryKeys } from "./keys";

export const useOrderDetail = (orderId: string | null) =>
  useQuery({
    queryKey: queryKeys.orders.detail(orderId ?? ""),
    queryFn: () => ordersClient.get(orderId!),
    enabled: Boolean(orderId),
  });

export const useOrdersList = (filters: { eventId?: string } = {}) =>
  useInfiniteQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: ({ pageParam }) =>
      ordersClient.list({
        eventId: filters.eventId,
        cursor: pageParam ?? undefined,
        limit: 20,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? null,
  });

export const useRefundOrder = (orderId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { amountCents?: number; reason?: string }) =>
      ordersClient.refund(orderId, input),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.orders.all() });
      qc.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
    },
  });
};
