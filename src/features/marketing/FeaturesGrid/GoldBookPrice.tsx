"use client";

import { useTranslations } from "next-intl";
import { useVisitorKeepsakePrice } from "../useVisitorPrices";
import { GOLD_BOOK_PRODUCT_TYPE } from "../pricingIds";

export const GoldBookPrice = ({ fallbackPrice }: { fallbackPrice: string }) => {
  const t = useTranslations();
  const price = useVisitorKeepsakePrice(GOLD_BOOK_PRODUCT_TYPE, fallbackPrice);

  return (
    <p className="text-foreground type-body-small font-semibold">
      {t("marketing__features__book_price", { price })}
    </p>
  );
};
