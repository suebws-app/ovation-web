import { clientFetch } from "./client";

export const planPurchasesClient = {
  get: (id: string) =>
    clientFetch<{ purchase: { id: string; status: string; planCode: string } }>(
      `/payments/plan-purchases/${id}`,
    ),
};
