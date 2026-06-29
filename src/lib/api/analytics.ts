import { apiFetch } from "./server";
import type { AccountAnalytics, AnalyticsRange } from "./types";

export const analyticsApi = {
  me: (query: { range?: AnalyticsRange } = {}) =>
    apiFetch<AccountAnalytics>("/insights/me", { query }),
};
