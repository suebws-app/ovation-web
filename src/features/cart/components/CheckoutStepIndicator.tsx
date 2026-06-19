"use client";

import { useTranslations } from "next-intl";
import { CheckoutStepDot } from "./CheckoutStepDot";

type CheckoutStep = "cart" | "address" | "payment" | "confirm";

type CheckoutStepIndicatorProps = {
  active: CheckoutStep;
  hideCart?: boolean;
};

const ALL_STEPS: Array<{ key: CheckoutStep; labelKey: string }> = [
  { key: "cart", labelKey: "cart__step__cart" },
  { key: "address", labelKey: "cart__step__address" },
  { key: "payment", labelKey: "cart__step__payment" },
  { key: "confirm", labelKey: "cart__step__confirm" },
];

export const CheckoutStepIndicator = ({
  active,
  hideCart = false,
}: CheckoutStepIndicatorProps) => {
  const t = useTranslations();
  const STEPS = hideCart
    ? ALL_STEPS.filter((s) => s.key !== "cart")
    : ALL_STEPS;
  const activeIndex = STEPS.findIndex((s) => s.key === active);
  return (
    <div className="border-border bg-card flex items-center rounded-full border px-2.5 py-2">
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
