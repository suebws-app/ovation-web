export const isPaidPlan = (planTier?: string | null): boolean =>
  Boolean(planTier) && planTier !== "free" && planTier !== "pro_free";
