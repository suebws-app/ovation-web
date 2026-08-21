import { getTranslations } from "next-intl/server";
import { SectionTitle } from "@/components/SectionTitle";
import { CurrencySelectStatic } from "@/components/CurrencySelect/CurrencySelectStatic";
import { PricingCard } from "../PricingSection/PricingCard";
import { PRO_TIERS } from "../PricingSection/constants";
import { plansApi } from "@/lib/api/plans";
import type { Plan } from "@/lib/api/types";
import { PRICING_ANCHOR } from "./constants";

const fetchProPlans = async (): Promise<Plan[]> => {
  try {
    const { plans } = await plansApi.publicList("pro");
    return plans;
  } catch {
    return [];
  }
};

export const ForProsPricing = async () => {
  const t = await getTranslations();
  const plans = await fetchProPlans();
  const plansByCode = new Map(plans.map((plan) => [plan.code, plan]));

  const tiers = PRO_TIERS.map((tier) => {
    const formatted = tier.planCode
      ? plansByCode.get(tier.planCode)?.productVariables?.regularPriceFormatted
      : undefined;
    return formatted ? { ...tier, price: formatted } : tier;
  });

  return (
    <section
      id={PRICING_ANCHOR}
      className="bg-card border-border scroll-mt-24 border-t"
    >
      <div className="section-container">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <SectionTitle as="h2">
            {t("marketing__for_pros__pricing_title")}
          </SectionTitle>
          <p className="text-muted-foreground mx-auto max-w-xl">
            {t("marketing__for_pros__pricing_subtitle")}
          </p>
          <CurrencySelectStatic />
        </div>

        <div className="tablet:grid-cols-2 mx-auto grid max-w-3xl grid-cols-1 gap-5">
          {tiers.map(({ key, ...tier }) => (
            <PricingCard key={key} {...tier} />
          ))}
        </div>
      </div>
    </section>
  );
};
