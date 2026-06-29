"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { analyticsClient } from "@/lib/api/analytics-client";
import type { AccountAnalytics, AnalyticsRange } from "@/lib/api/types";
import { queryKeys } from "./keys";

export const useAccountAnalytics = (
  range: AnalyticsRange,
  initialData?: AccountAnalytics,
) =>
  useQuery({
    queryKey: queryKeys.analytics.me(range),
    queryFn: ({ signal }) => analyticsClient.me(range, signal),
    placeholderData: keepPreviousData,
    initialData:
      initialData && initialData.range === range ? initialData : undefined,
  });
