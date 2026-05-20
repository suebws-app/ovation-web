"use client";

import { useTranslations } from "next-intl";
import { CheckoutStepDot } from "./CheckoutStepDot";

type CheckoutStep = "cart" | "address" | "payment" | "confirm";

type CheckoutStepIndicatorProps = {
  active: CheckoutStep;
};

const STEPS: Array<{ key: CheckoutStep; labelKey: string }> = [
  { key: "cart", labelKey: "cart__step__cart" },
  { key: "address", labelKey: "cart__step__address" },
  { key: "payment", labelKey: "cart__step__payment" },
  { key: "confirm", labelKey: "cart__step__confirm" },
];

export const CheckoutStepIndicator = ({ active }: CheckoutStepIndicatorProps) => {
  const t = useTranslations();
  const activeIndex = STEPS.findIndex((s) => s.key === active);
  return (
    <div className="border-border bg-card rounded-full flex items-center border px-2.5 py-2">
      {STEPS.map((step, index) => (
        <CheckoutStepDot
          key={step.key}
          index={index}
          label={t(step.labelKey)}
          state={
            index < activeIndex
              ? "done"
              : index === activeIndex
                ? "active"
                : "upcoming"
          }
          isLast={index === STEPS.length - 1}
        />
      ))}
    </div>
  );
};
