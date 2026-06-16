"use client";

import { useQuery } from "@tanstack/react-query";
import { currencyClient } from "@/lib/api/currency-client";
import { queryKeys } from "./keys";

const ONE_HOUR_MS = 60 * 60 * 1000;

export const useSupportedCurrencies = () =>
  useQuery({
    queryKey: queryKeys.currencies.supported(),
    queryFn: () => currencyClient.list(),
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
  });
