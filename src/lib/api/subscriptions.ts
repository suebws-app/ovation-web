import { apiFetch } from "./server";
import type { ProSubscription, Subscription } from "./types";

export const subscriptionsApi = {
  get: (eventId: string) =>
    apiFetch<{ subscription: Subscription | null }>(
      `/events/${eventId}/subscription`,
    ),

  getMyPro: () =>
    apiFetch<{ subscription: ProSubscription | null }>(
      `/subscriptions/me/pro`,
    ),
};
