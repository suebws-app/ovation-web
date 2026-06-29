"use client";

import { useTranslations } from "next-intl";

export const ChartEmptyState = () => {
  const t = useTranslations();
  return (
    <div className="text-muted-foreground type-caption flex h-64 w-full items-center justify-center">
      {t("analytics__charts__empty")}
    </div>
  );
};
