import { apiFetch } from "./server";
import type { KeepsakeCatalog } from "./types";

export const keepsakesApi = {
  catalog: () =>
    apiFetch<KeepsakeCatalog>("/keepsakes/catalog", {
      cache: "force-cache",
      next: { revalidate: 3600 },
    }),
};
