"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { appRoutes } from "@/lib/routes";
import { CheckoutStepIndicator } from "./CheckoutStepIndicator";

type CartHeroProps = {
  itemCount: number;
  step?: "cart" | "address" | "payment" | "confirm";
};

export const CartHero = ({ itemCount, step = "cart" }: CartHeroProps) => {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-3">
      <Link
        href={appRoutes.app.keepsakes}
        className="text-muted-foreground hover:text-foreground type-caption inline-flex items-center gap-1.5 self-start tracking-wider"
      >
        <ArrowRightIcon width={12} height={12} className="rotate-180" />
        {t("cart__hero__back")}
      </Link>
      <div className="tablet:flex-row tablet:items-end tablet:justify-between flex flex-col items-start gap-5">
        <div>
          <span className="type-overline text-primary tracking-widest">
            {t("cart__hero__eyebrow")}
          </span>
          <h1 className="type-h1 mt-2 leading-none font-semibold tracking-tight">
            <span>{t("cart__hero__title_a", { count: itemCount })}</span>{" "}
            <span className="text-primary italic">
              {t("cart__hero__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mt-3 max-w-145 leading-relaxed">
            {t("cart__hero__description")}
          </p>
        </div>
        <CheckoutStepIndicator active={step === "cart" ? "cart" : "address"} />
      </div>
    </div>
  );
};
