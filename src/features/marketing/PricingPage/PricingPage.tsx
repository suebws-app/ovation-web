import { getTranslations, setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/i18n/types";
import { PricingSection } from "../PricingSection";
import { FAQSection } from "../LandingPage/FAQSection";
import { PageBreadcrumbJsonLd } from "../components/PageBreadcrumbJsonLd";
import { JsonLd } from "@/components/JsonLd";
import { productSchema } from "@/lib/seo/schemas";
import { localizedAbsoluteUrl } from "@/lib/seo/urls";
import { plansApi } from "@/lib/api/plans";
import type { Plan } from "@/lib/api/types";

const collectPaidPrices = (plans: Plan[]): Plan[] =>
  plans.filter((plan) => plan.priceCents > 0);

const fetchPricingPlans = async (): Promise<Plan[]> => {
  try {
    const [couples, pros] = await Promise.all([
      plansApi.publicList("couple"),
      plansApi.publicList("pro"),
    ]);
    return [...couples.plans, ...pros.plans];
  } catch {
    return [];
  }
};

const toPrice = (cents: number): string => (cents / 100).toFixed(2);

export const PricingPage = async ({ params }: LocalePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const pricingUrl = localizedAbsoluteUrl(locale, "/pricing");
  const paidPlans = collectPaidPrices(await fetchPricingPlans());

  const pricingJsonLd =
    paidPlans.length > 0
      ? productSchema({
          name: t("seo__pricing__title"),
          description: t("seo__pricing__description"),
          url: pricingUrl,
          aggregateOffer: {
            lowPrice: toPrice(
              Math.min(...paidPlans.map((plan) => plan.priceCents)),
            ),
            highPrice: toPrice(
              Math.max(...paidPlans.map((plan) => plan.priceCents)),
            ),
            priceCurrency: paidPlans[0].currency,
            offerCount: paidPlans.length,
            url: pricingUrl,
          },
        })
      : null;

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} page="pricing" path="/pricing" />
      {pricingJsonLd ? <JsonLd data={pricingJsonLd} /> : null}
      <PricingSection titleAs="h1" />
      <FAQSection />
    </>
  );
};
