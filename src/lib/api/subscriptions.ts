import { apiFetch } from "./server";
import type { MeBillingOverview, MeBillingHistoryItem } from "./types";

export const subscriptionsApi = {
  getMine: () => apiFetch<MeBillingOverview>(`/subscriptions/me`),

  getMyHistory: () =>
    apiFetch<{ items: MeBillingHistoryItem[] }>(
      `/subscriptions/me/history`,
    ),
};
