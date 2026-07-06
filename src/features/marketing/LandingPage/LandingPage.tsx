import dynamic from "next/dynamic";
import { HeroSection } from "@/features/marketing/HeroSection";
import { PricingTeaser } from "./PricingTeaser";
import { keepsakesApi } from "@/lib/api/keepsakes";
import { plansApi } from "@/lib/api/plans";
import { formatPrice } from "@/features/checkout/orderHelpers";

const HowItWorks = dynamic(() =>
  import("./HowItWorks").then((m) => ({
    default: m.HowItWorks,
  })),
);
const SampleSpread = dynamic(() =>
  import("@/features/marketing/SampleSpread").then((m) => ({
    default: m.SampleSpread,
  })),
);
const FeaturesGrid = dynamic(() =>
  import("@/features/marketing/FeaturesGrid").then((m) => ({
    default: m.FeaturesGrid,
  })),
);
const FAQSection = dynamic(() =>
  import("./FAQSection").then((m) => ({
    default: m.FAQSection,
  })),
);
const FinalCTA = dynamic(() =>
  import("./FinalCTA").then((m) => ({
    default: m.FinalCTA,
  })),
);

const GOLD_BOOK_PRODUCT_TYPE = "hardcover";
const GOLD_BOOK_FALLBACK_PRICE = "€59";
const COUPLE_PLAN_FALLBACK_PRICE = "€189";
const PRO_PLAN_FALLBACK_PRICE = "€49";

const fetchGoldBookPrice = async (): Promise<string> => {
  try {
    const { products } = await keepsakesApi.catalog();
    const book = products.find((p) => p.productType === GOLD_BOOK_PRODUCT_TYPE);
    if (!book) return GOLD_BOOK_FALLBACK_PRICE;
    return formatPrice(book.priceCents, book.currency);
  } catch {
    return GOLD_BOOK_FALLBACK_PRICE;
  }
};

const fetchPlanPrice = async (
  code: string,
  fallback: string,
): Promise<string> => {
  try {
    const plan = await plansApi.findByCode(code);
    return plan.productVariables.regularPriceFormatted ?? fallback;
  } catch {
    return fallback;
  }
};

export const LandingPage = async () => {
  const [goldBookPrice, couplePrice, proPrice] = await Promise.all([
    fetchGoldBookPrice(),
    fetchPlanPrice("premium", COUPLE_PLAN_FALLBACK_PRICE),
    fetchPlanPrice("pro_starter", PRO_PLAN_FALLBACK_PRICE),
  ]);

  return (
    <>
      <HeroSection />
      <HowItWorks />
      <SampleSpread />
      <FeaturesGrid goldBookPrice={goldBookPrice} />
      <PricingTeaser couplePrice={couplePrice} proPrice={proPrice} />
      <FAQSection />
      <FinalCTA />
    </>
  );
};
