"use client";

import { useQuery } from "@tanstack/react-query";
import { plansClient } from "@/lib/api/plans-client";
import { queryKeys } from "./keys";

const ONE_HOUR_MS = 60 * 60 * 1000;

export const usePlans = () =>
  useQuery({
    queryKey: queryKeys.plans.list(),
    queryFn: () => plansClient.list(),
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
  });
