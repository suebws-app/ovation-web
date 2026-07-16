"use client";

import { useTranslations } from "next-intl";
import { useVisitorPlanPrice } from "../useVisitorPrices";
import { COUPLE_PLAN_CODE, PRO_PLAN_CODE } from "../pricingIds";

type PricingTeaserBodyProps = {
  coupleFallbackPrice: string;
  proFallbackPrice: string;
};

export const PricingTeaserBody = ({
  coupleFallbackPrice,
  proFallbackPrice,
}: PricingTeaserBodyProps) => {
  const t = useTranslations();
  const couplePrice = useVisitorPlanPrice(
    COUPLE_PLAN_CODE,
    coupleFallbackPrice,
  );
  const proPrice = useVisitorPlanPrice(PRO_PLAN_CODE, proFallbackPrice);

  return (
    <p className="text-muted-foreground type-body-large mt-5 max-w-140 leading-relaxed">
      {t("marketing__pricing_teaser__body", { couplePrice, proPrice })}
    </p>
  );
};
