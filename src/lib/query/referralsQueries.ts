"use client";

import { useQuery } from "@tanstack/react-query";
import { referralsClient } from "@/lib/api/referrals-client";
import { queryKeys } from "./keys";

export type { ReferralSummary } from "@/lib/api/referrals-client";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export const useMyReferralSummary = () =>
  useQuery({
    queryKey: queryKeys.referrals.me(),
    queryFn: () => referralsClient.me(),
    staleTime: FIVE_MINUTES_MS,
    gcTime: FIVE_MINUTES_MS,
  });
