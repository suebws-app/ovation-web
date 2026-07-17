"use client";

import { useVisitorPlanPrice } from "../useVisitorPrices";

type PlanPriceProps = {
  planCode: string;
  fallbackPrice: string;
};

export const PlanPrice = ({ planCode, fallbackPrice }: PlanPriceProps) => {
  const price = useVisitorPlanPrice(planCode, fallbackPrice);
  return <>{price}</>;
};
