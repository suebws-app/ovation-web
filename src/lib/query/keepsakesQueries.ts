"use client";

import { useQuery } from "@tanstack/react-query";
import { keepsakesClient } from "@/lib/api/keepsakes-client";
import { queryKeys } from "./keys";

const ONE_HOUR_MS = 60 * 60 * 1000;

export const useKeepsakeCatalog = () =>
  useQuery({
    queryKey: queryKeys.keepsakes.catalog(),
    queryFn: () => keepsakesClient.catalog(),
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
  });
