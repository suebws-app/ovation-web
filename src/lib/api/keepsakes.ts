import { cookies } from "next/headers";
import { apiFetch, publicApiFetch } from "./server";
import type { KeepsakeCatalog, KeepsakeProductDetailResult } from "./types";
import { CURRENCY_COOKIE, isSupportedCurrency } from "@/i18n/currency-config";

const readVisitorCurrency = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CURRENCY_COOKIE)?.value?.toUpperCase();
  return isSupportedCurrency(raw) ? raw : undefined;
};

export const keepsakesApi = {
  catalog: async () => {
    const currency = await readVisitorCurrency();
    return apiFetch<KeepsakeCatalog>("/keepsakes/catalog", {
      query: currency ? { currency } : undefined,
      cache: "force-cache",
      next: { revalidate: 60, tags: ["keepsakes-catalog"] },
    });
  },

  publicCatalog: () =>
    publicApiFetch<KeepsakeCatalog>("/keepsakes/catalog", {
      cache: "force-cache",
      next: { revalidate: 300, tags: ["keepsakes-catalog"] },
    }),

  productByType: async (productType: string) => {
    const currency = await readVisitorCurrency();
    return apiFetch<KeepsakeProductDetailResult>(
      `/keepsakes/products/${encodeURIComponent(productType)}`,
      {
        query: currency ? { currency } : undefined,
        cache: "force-cache",
        next: { revalidate: 60, tags: ["keepsakes-catalog"] },
      },
    );
  },
};
