import { apiFetch } from "./server";
import type { Plan, PlanAudience } from "./types";

export const plansApi = {
  list: (audience?: PlanAudience) =>
    apiFetch<{ plans: Plan[] }>(
      audience ? `/plans?audience=${audience}` : "/plans",
    ),
  findByCode: (code: string) => apiFetch<Plan>(`/plans/${code}`),
};
