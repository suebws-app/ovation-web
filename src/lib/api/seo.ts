import { apiFetch } from "./server";
import type { ApiFetchOptions } from "./client";

export interface GscKeywordRow {
  keyword: string;
  page: string;
  position: number;
  impressions: number;
  clicks: number;
  ctr: number;
}

export interface GscKeywordsResponse {
  rows: GscKeywordRow[];
  lastSyncedAt: string | null;
}

export interface SeoTrafficSummary {
  totalClicks: number;
  totalImpressions: number;
  averagePosition: number;
  lastSyncedAt: string | null;
}

const seoCacheOptions: ApiFetchOptions = {
  cache: "force-cache",
  next: { revalidate: 900, tags: ["seo"] },
};

export const seoApi = {
  refreshCandidates: (minPos = 4, maxPos = 20, limit = 50) =>
    apiFetch<GscKeywordsResponse>("/admin/seo/keywords/refresh-candidates", {
      query: { minPos, maxPos, limit },
      ...seoCacheOptions,
    }),

  topKeywords: (limit = 50) =>
    apiFetch<GscKeywordsResponse>("/admin/seo/keywords/top", {
      query: { limit },
      ...seoCacheOptions,
    }),

  trafficSummary: () =>
    apiFetch<SeoTrafficSummary>("/admin/seo/summary", seoCacheOptions),
};
