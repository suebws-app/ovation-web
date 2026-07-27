"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useHydrateStore } from "@/lib/storage/useHydrateStore";
import { normalizePromoCode, usePromoStore } from "./usePromoStore";

export const PromoCapture = () => {
  const searchParams = useSearchParams();
  const hydrated = useHydrateStore(usePromoStore);

  useEffect(() => {
    if (!hydrated) return;
    const fromUrl = normalizePromoCode(searchParams.get("promo"));
    if (fromUrl) usePromoStore.getState().setCode(fromUrl);
  }, [hydrated, searchParams]);

  return null;
};
