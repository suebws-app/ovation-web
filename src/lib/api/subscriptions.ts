import { apiFetch } from "./server";
import type {
  MySubscription,
  MySubscriptionHistoryItem,
  Subscription,
} from "./types";

export const subscriptionsApi = {
  get: (eventId: string) =>
    apiFetch<{ subscription: Subscription | null }>(
      `/events/${eventId}/subscription`,
    ),

  getMine: () =>
    apiFetch<{ subscription: MySubscription | null }>(`/subscriptions/me`),

  getMyHistory: () =>
    apiFetch<{ items: MySubscriptionHistoryItem[] }>(
      `/subscriptions/me/history`,
    ),
};
