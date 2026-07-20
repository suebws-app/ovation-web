import { useQuery } from "@tanstack/react-query";
import { coverTemplatesClient } from "@/lib/api/cover-templates-client";
import type { CoverTemplatesResponse } from "@/lib/api/types";
import { queryKeys } from "./keys";

const FIVE_MINUTES = 5 * 60 * 1000;

export const useCoverTemplatesQuery = () =>
  useQuery<CoverTemplatesResponse>({
    queryKey: queryKeys.coverTemplates.list(),
    queryFn: coverTemplatesClient.list,
    staleTime: FIVE_MINUTES,
    gcTime: FIVE_MINUTES,
  });
