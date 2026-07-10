"use client";

import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { PlanCard } from "@/features/plans/components/PlanCard";
import { usePlans } from "@/lib/query/plansQueries";

const PLAN_CODE_BY_ID: Record<string, string> = {
  keepsake: "premium",
  gold: "bundle",
};

const FALLBACK_PRICE_BY_ID: Record<string, string> = {
  keepsake: "€49",
  gold: "€99",
};

export const CouplePlan = () => {
  const t = useTranslations();
  const { updateFormData } = useSignUpStore();
  const router = useRouter();
  const { data } = usePlans();

  const priceFor = (planId: string) => {
    const plan = data?.plans.find((p) => p.code === PLAN_CODE_BY_ID[planId]);
    return (
      plan?.productVariables.regularPriceFormatted ??
      FALLBACK_PRICE_BY_ID[planId]
    );
  };

  const PLANS = [
    {
      id: "keepsake",
      name: t("signup__plan__keepsake__name"),
      price: priceFor("keepsake"),
      per: t("signup__plan__keepsake__per"),
      description: t("signup__plan__keepsake__description_v2"),
      features: [
        t("signup__plan__keepsake__feature_1_v2"),
        t("signup__plan__keepsake__feature_2_v2"),
        t("signup__plan__keepsake__feature_3"),
        t("signup__plan__keepsake__feature_4_v2"),
      ],
      highlighted: true,
    },
    {
      id: "gold",
      name: t("signup__plan__gold__name_v2"),
      price: priceFor("gold"),
      per: t("signup__plan__gold__per"),
      description: t("signup__plan__gold__description_v2"),
      features: [
        t("signup__plan__gold__feature_1"),
        t("signup__plan__gold__feature_2_v2"),
        t("signup__plan__gold__feature_3"),
        t("signup__plan__gold__feature_4"),
      ],
    },
  ];

  const handleSelect = (planId: string) => {
    updateFormData({ selectedPlan: planId });
    router.push(appRoutes.checkout.root);
  };

  return (
    <div className="bg-background min-h-[calc(100vh-89px)]">
      <div className="mx-auto max-w-310 px-14 py-14">
        <div className="mb-10 text-center">
          <Kicker className="text-primary">
            {t("signup__plan__step_label")}
          </Kicker>
          <h1 className="tablet:type-h0 type-h1 mt-3.5 leading-tight font-semibold tracking-tight">
            {t("signup__plan__title_a")}{" "}
            <span className="text-primary italic">
              {t("signup__plan__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mx-auto mt-3.5 max-w-140 leading-relaxed">
            {t("signup__plan__subtitle")}
          </p>
        </div>

        <div className="tablet:grid-cols-2 grid gap-4.5">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              per={plan.per}
              description={plan.description}
              features={plan.features}
              highlighted={plan.highlighted}
              showBillingDisclaimer
              onSelect={() => handleSelect(plan.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
