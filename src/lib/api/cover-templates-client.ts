import { clientFetch } from "./client";
import type { CoverTemplatesResponse } from "./types";

export const coverTemplatesClient = {
  list: () => clientFetch<CoverTemplatesResponse>("/cover-templates"),
};
