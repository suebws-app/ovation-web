import dynamic from "next/dynamic";
import { HeroSection } from "@/features/marketing/HeroSection";
import { LogoBar } from "@/features/marketing/LogoBar";

const HowItWorks = dynamic(() =>
  import("@/features/marketing/HowItWorks").then((m) => ({
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
  import("@/features/marketing/TestimonialSection").then((m) => ({
    default: m.TestimonialSection,
  })),
);
const PricingSection = dynamic(() =>
  import("@/features/marketing/PricingSection").then((m) => ({
    default: m.PricingSection,
  })),
);
const FAQSection = dynamic(() =>
  import("@/features/marketing/FAQSection").then((m) => ({
    default: m.FAQSection,
  })),
);
const FinalCTA = dynamic(() =>
  import("@/features/marketing/FinalCTA").then((m) => ({
    default: m.FinalCTA,
  })),
);

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <LogoBar />
      <HowItWorks />
      <SampleSpread />
      <FeaturesGrid />
      <TestimonialSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
};
