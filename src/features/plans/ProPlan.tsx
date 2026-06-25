"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Button } from "@ovation/ui/components/Button";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { PlanOptionCard } from "@/features/plans/components/PlanOptionCard";
import { PRO_TIERS } from "@/features/marketing/PricingSection/constants";

export const ProPlan = () => {
  const t = useTranslations();
  const { formData, updateFormData } = useSignUpStore();
  const router = useRouter();
  const [showError, setShowError] = useState(false);

  const handleSelect = (key: string) => {
    updateFormData({ selectedPlan: key });
    setShowError(false);
  };

  const handleContinue = () => {
    if (!formData.selectedPlan) {
      setShowError(true);
      return;
    }
    router.push(appRoutes.checkout.root);
  };

  return (
    <div className="flex min-h-[calc(100vh-89px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <Kicker className="text-primary mb-3">
          {t("signup__pro_plan__step_label")}
        </Kicker>
        <h1 className="type-h1 leading-tight font-semibold tracking-tight">
          {t("signup__pro_plan__title")}
          <br />
          <span className="text-primary italic">
            {t("signup__pro_plan__title_b")}
          </span>
        </h1>
        <p className="text-muted-foreground type-body-small mt-3 leading-relaxed">
          {t("signup__pro_plan__subtitle")}
        </p>

        <div className="tablet:grid-cols-2 mt-10 grid grid-cols-1 gap-5">
          {PRO_TIERS.map(
            ({ key, tagKey, nameKey, price, perKey, descKey, featKeys }) => (
              <PlanOptionCard
                key={key}
                planKey={key}
                isSelected={formData.selectedPlan === key}
                tagLabel={t(tagKey)}
                name={t(nameKey)}
                price={price}
                per={t(perKey)}
                desc={t(descKey)}
                features={featKeys.map((k) => t(k))}
                onSelect={handleSelect}
              />
            ),
          )}
        </div>

        {showError && !formData.selectedPlan && (
          <p className="text-destructive type-body-small mt-6 text-center">
            {t("signup__pro_plan__select_required")}
          </p>
        )}

        <Button
          type="button"
          onClick={handleContinue}
          disabled={!formData.selectedPlan}
          className="shadow-primary/40 mt-8 w-full rounded-full shadow-md"
        >
          {t("signup__pro_plan__continue")}
        </Button>
      </div>
    </div>
  );
};
