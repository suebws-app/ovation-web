"use client";

import { useTranslations } from "next-intl";
import { useVisitorPlanPrice } from "../useVisitorPrices";
import { STORAGE_EXTENSION_PLAN_CODE } from "../pricingIds";
import type { FAQ_ITEM_KEYS } from "./constants";

type FAQAnswerProps = {
  answerKey: (typeof FAQ_ITEM_KEYS)[number]["a"];
  dreFallbackPrice: string;
};

export const FAQAnswer = ({ answerKey, dreFallbackPrice }: FAQAnswerProps) => {
  const t = useTranslations();
  const drePrice = useVisitorPlanPrice(
    STORAGE_EXTENSION_PLAN_CODE,
    dreFallbackPrice,
  );

  return <>{t(answerKey, { drePrice })}</>;
};
