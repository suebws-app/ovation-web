import { clientFetch } from "./client";
import type { AccountAnalytics, AnalyticsRange } from "./types";

export const analyticsClient = {
  me: (range: AnalyticsRange, signal?: AbortSignal) =>
    clientFetch<AccountAnalytics>("/insights/me", {
      query: { range },
      signal,
    }),
};
