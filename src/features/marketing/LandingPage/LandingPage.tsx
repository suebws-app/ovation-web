import dynamic from "next/dynamic";
import { HeroSection } from "@/features/marketing/HeroSection";
import { LogoBar } from "@/features/marketing/LogoBar";
import { keepsakesApi } from "@/lib/api/keepsakes";
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
const TestimonialSection = dynamic(() =>
  import("./TestimonialSection").then((m) => ({
    default: m.TestimonialSection,
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

export const LandingPage = async () => {
  const goldBookPrice = await fetchGoldBookPrice();

  return (
    <>
      <HeroSection />
      <LogoBar />
      <HowItWorks />
      <SampleSpread />
      <FeaturesGrid goldBookPrice={goldBookPrice} />
      <TestimonialSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
};
