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
import { CurrencySelectStatic } from "@/components/CurrencySelect/CurrencySelectStatic";
import { plansApi } from "@/lib/api/plans";
import type { Plan } from "@/lib/api/types";

type CardTier = Omit<Tier, "key"> & { key: string };

const toCardTier = (tier: Tier, plansByCode: Map<string, Plan>): CardTier => {
  const plan = tier.planCode ? plansByCode.get(tier.planCode) : undefined;
  const formatted = plan?.productVariables?.regularPriceFormatted;
  const { key, ...rest } = formatted ? { ...tier, price: formatted } : tier;
  return { key, ...rest };
};

const fetchPlansSafely = async (
  audience: "couple" | "pro",
): Promise<Plan[]> => {
  try {
    const { plans } = await plansApi.publicList(audience);
    return plans;
  } catch {
    return [];
  }
};

type PricingSectionProps = {
  titleAs?: "h1" | "h2";
};

export const PricingSection = async ({
  titleAs = "h2",
}: PricingSectionProps) => {
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
          <SectionTitle as={titleAs}>
            {t("marketing__pricing__title")}
          </SectionTitle>
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
            <CurrencySelectStatic />
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
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
