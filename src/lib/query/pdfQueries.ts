"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  keepsakesClient,
  type KeepsakePreviewInput,
  type RenderStatus,
} from "@/lib/api/keepsakes-client";
import { queryKeys } from "./keys";

export const useCreateKeepsakePreview = () =>
  useMutation({
    mutationFn: (input: KeepsakePreviewInput) =>
      keepsakesClient.createKeepsakePreview(input),
  });

export const useRenderStatus = (renderId: string | null) =>
  useQuery<RenderStatus>({
    queryKey: queryKeys.pdf.render(renderId ?? ""),
    queryFn: () => keepsakesClient.getRender(renderId!),
    enabled: !!renderId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 2000;
      if (data.status === "completed" || data.status === "failed") return false;
      return 2000;
    },
  });
