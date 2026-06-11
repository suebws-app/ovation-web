import { apiFetch } from "./server";
import type { KeepsakeCatalog, KeepsakeProductDetailResult } from "./types";

export const keepsakesApi = {
  catalog: () =>
    apiFetch<KeepsakeCatalog>("/keepsakes/catalog", {
      cache: "force-cache",
      next: { revalidate: 60, tags: ["keepsakes-catalog"] },
    }),

  productByType: (productType: string) =>
    apiFetch<KeepsakeProductDetailResult>(
      `/keepsakes/products/${encodeURIComponent(productType)}`,
      {
        cache: "force-cache",
        next: { revalidate: 60, tags: ["keepsakes-catalog"] },
      },
    ),
};
