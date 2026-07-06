import { getTranslations } from "next-intl/server";
import { Kicker } from "@ovation/ui/components/Kicker";
import { SectionTitle } from "../../../components/SectionTitle";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@ovation/ui/components/Tabs";
import { PricingCard } from "./PricingCard";
import { COUPLES_TIERS, PRO_TIERS, type Tier } from "./constants";
import { CurrencySelect } from "@/components/CurrencySelect";
import { plansApi } from "@/lib/api/plans";
import type { Plan } from "@/lib/api/types";

type CardTier = Omit<Tier, "key" | "planCode"> & { key: string };

const toCardTier = (tier: Tier, plansByCode: Map<string, Plan>): CardTier => {
  const plan = tier.planCode ? plansByCode.get(tier.planCode) : undefined;
  const formatted = plan?.productVariables?.regularPriceFormatted;
  const {
    key,
    planCode: _planCode,
    ...rest
  } = formatted ? { ...tier, price: formatted } : tier;
  void _planCode;
  return { key, ...rest };
};

const fetchPlansSafely = async (
  audience: "couple" | "pro",
): Promise<Plan[]> => {
  try {
    const { plans } = await plansApi.list(audience);
    return plans;
  } catch {
    return [];
  }
};

export const PricingSection = async () => {
  const t = await getTranslations();

  const [couplePlans, proPlans] = await Promise.all([
    fetchPlansSafely("couple"),
    fetchPlansSafely("pro"),
  ]);

  const couplePlansByCode = new Map(couplePlans.map((p) => [p.code, p]));
  const proPlansByCode = new Map(proPlans.map((p) => [p.code, p]));

  const couplesTiers = COUPLES_TIERS.map((tier) =>
    toCardTier(tier, couplePlansByCode),
  );
  const proTiers = PRO_TIERS.map((tier) => toCardTier(tier, proPlansByCode));

  return (
    <section className="bg-card border-border border-t">
      <div className="section-container">
        <div className="mb-10 text-center">
          <Kicker className="text-muted-foreground mb-4">
            {t("marketing__pricing__eyebrow")}
          </Kicker>
          <SectionTitle>{t("marketing__pricing__title")}</SectionTitle>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl">
            {t("marketing__pricing__subtitle")}
          </p>
        </div>

        <Tabs defaultValue="couples" className="items-center">
          <div className="mb-10 flex flex-col items-center gap-4">
            <TabsList>
              <TabsTrigger value="couples">
                {t("marketing__pricing__tab_couples")}
              </TabsTrigger>
              <TabsTrigger value="professionals">
                {t("marketing__pricing__tab_professionals")}
              </TabsTrigger>
            </TabsList>
            <CurrencySelect />
          </div>

          <TabsContent value="couples">
            <div className="tablet:grid-cols-2 mx-auto grid max-w-3xl grid-cols-1 gap-5">
              {couplesTiers.map(({ key, ...tier }) => (
                <PricingCard key={key} {...tier} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="professionals">
            <div className="tablet:grid-cols-2 mx-auto grid max-w-3xl grid-cols-1 gap-5">
              {proTiers.map(({ key, ...tier }) => (
                <PricingCard key={key} {...tier} />
              ))}
            </div>
            <p className="text-muted-foreground type-body-small mx-auto mt-6 max-w-3xl text-center">
              {t("marketing__pricing__pro_trial_note")}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
