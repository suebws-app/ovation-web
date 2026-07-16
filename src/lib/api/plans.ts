import { apiFetch } from "./server";
import type { Plan, PlanAudience } from "./types";

import type { ApiFetchOptions } from "./client";

const planCacheOptions: ApiFetchOptions = {
  cache: "force-cache",
  next: { revalidate: 300, tags: ["plans"] },
};

export const plansApi = {
  list: (audience?: PlanAudience) =>
    apiFetch<{ plans: Plan[] }>(
      audience ? `/plans?audience=${audience}` : "/plans",
      planCacheOptions,
    ),
  findByCode: (code: string) =>
    apiFetch<Plan>(`/plans/${code}`, planCacheOptions),
};
