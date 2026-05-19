import { apiFetch } from "./server";
import type {
  MeBillingOverview,
  MeBillingHistoryItem,
  Subscription,
} from "./types";

export const subscriptionsApi = {
  get: (eventId: string) =>
    apiFetch<{ subscription: Subscription | null }>(
      `/events/${eventId}/subscription`,
    ),

  getMine: () => apiFetch<MeBillingOverview>(`/subscriptions/me`),

  getMyHistory: () =>
    apiFetch<{ items: MeBillingHistoryItem[] }>(
      `/subscriptions/me/history`,
    ),
};
