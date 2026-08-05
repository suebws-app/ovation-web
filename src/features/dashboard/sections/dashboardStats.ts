import { cache } from "react";
import { ApiError, type Paginated } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { ordersApi } from "@/lib/api/orders";
import type { EventStats, Order } from "@/lib/api/types";

export const getEventStats = cache(
  async (eventId: string): Promise<EventStats | null> => {
    try {
      return await eventsApi.stats(eventId, { includeOwnerUploads: true });
    } catch (error) {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }
  },
);

export const getRecentOrders = cache(
  async (eventId: string): Promise<Paginated<Order> | null> => {
    try {
      return await ordersApi.list({ eventId, limit: 3 });
    } catch (error) {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }
  },
);
