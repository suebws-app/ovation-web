"use client";

import { useLocale } from "next-intl";
import { usePlans } from "@/lib/query/plansQueries";
import { useKeepsakeCatalog } from "@/lib/query/keepsakesQueries";
import { formatPrice } from "@/features/checkout/orderHelpers";

export const useVisitorPlanPrice = (code: string, fallbackPrice: string) => {
  const { data } = usePlans();
  const plan = data?.plans.find((p) => p.code === code);
  return plan?.productVariables.regularPriceFormatted ?? fallbackPrice;
};

export const useVisitorKeepsakePrice = (
  productType: string,
  fallbackPrice: string,
) => {
  const locale = useLocale();
  const { data } = useKeepsakeCatalog();
  const product = data?.products.find((p) => p.productType === productType);
  return product
    ? formatPrice(product.priceCents, product.currency, locale)
    : fallbackPrice;
};
