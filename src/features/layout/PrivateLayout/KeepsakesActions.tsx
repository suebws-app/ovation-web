"use client";

import { useTranslations } from "next-intl";

export const KeepsakesActions = () => {
  const t = useTranslations();
  return (
    <div className="flex items-center gap-3">
      <span className="type-caption text-accent-foreground font-semibold">
        {t("sidebar__credit_available")}
      </span>
      <button
        type="button"
        className="border-border bg-card type-caption text-foreground hover:bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 font-semibold transition-colors"
      >
        {t("sidebar__cart", { count: 0 })}
      </button>
    </div>
  );
};
