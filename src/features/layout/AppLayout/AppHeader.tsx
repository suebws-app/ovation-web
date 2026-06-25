"use client";

import { useTranslations } from "next-intl";
import { CartButton } from "@/components/CartButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePageTitle } from "./usePageTitle";

const formatCredit = (cents: number) =>
  cents > 0 ? `€${(cents / 100).toFixed(0)}` : null;

export const AppHeader = () => {
  const t = useTranslations();
  const credit: string | null = formatCredit(0);
  const pageTitle = usePageTitle();

  return (
    <div className="max-w-container tablet:px-6 desktop:flex mx-auto hidden w-full items-center justify-between gap-3 px-4 pt-3 pb-1">
      <h1 className="type-h4 tracking-tight">{pageTitle}</h1>
      <div className="flex items-center gap-3">
        {credit && (
          <span className="type-caption text-accent-foreground font-semibold">
            {t("sidebar__credit_available", { amount: credit })}
          </span>
        )}
        <ThemeToggle />
        <CartButton />
      </div>
    </div>
  );
};
