"use client";

import { useTranslations } from "next-intl";

import { PageHeading } from "@/components/PageHeading";
import { CheckoutStepIndicator } from "./CheckoutStepIndicator";

type CartHeroProps = {
  itemCount: number;
  step?: "cart" | "payment" | "confirm";
  hideCart?: boolean;
};

export const CartHero = ({
  itemCount,
  step = "cart",
  hideCart = false,
}: CartHeroProps) => {
  const t = useTranslations();
  return (
    <div className="tablet:flex-row tablet:items-end tablet:justify-between flex flex-col items-start gap-5">
      <div>
        <PageHeading
          kicker={t("cart__hero__eyebrow")}
          kickerClassName="text-primary tracking-widest"
        >
          <span>{t("cart__hero__title_a", { count: itemCount })}</span>{" "}
          <span className="text-primary italic">
            {t("cart__hero__title_b")}
          </span>
        </PageHeading>
        <p className="type-body-small text-muted-foreground mt-3 max-w-145 leading-relaxed">
          {t("cart__hero__description")}
        </p>
      </div>
      <CheckoutStepIndicator active={step} hideCart={hideCart} />
    </div>
  );
};
