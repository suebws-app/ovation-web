import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/i18n/types";
import { LandingHero } from "./sections/LandingHero";

const ProductShowcase = dynamic(() =>
  import("./sections/ProductShowcase").then((m) => ({
    default: m.ProductShowcase,
  })),
);
const FlowsSection = dynamic(() =>
  import("./sections/FlowsSection").then((m) => ({
    default: m.FlowsSection,
  })),
);
const MemoryStrip = dynamic(() =>
  import("./sections/MemoryStrip").then((m) => ({
    default: m.MemoryStrip,
  })),
);
const KeepsakeSection = dynamic(() =>
  import("./sections/KeepsakeSection").then((m) => ({
    default: m.KeepsakeSection,
  })),
);
const FinalDarkCTA = dynamic(() =>
  import("./sections/FinalDarkCTA").then((m) => ({
    default: m.FinalDarkCTA,
  })),
);

export const LandingPage = async ({ params }: LocalePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <LandingHero />
      <ProductShowcase />
      <FlowsSection />
      <MemoryStrip />
      <KeepsakeSection />
      <FinalDarkCTA />
    </>
  );
};
