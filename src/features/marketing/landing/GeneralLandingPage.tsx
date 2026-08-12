import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/i18n/types";
import { LandingHero } from "./sections/LandingHero";
import { GENERAL_KEY_PREFIX } from "./variant";

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

export const GeneralLandingPage = async ({ params }: LocalePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <LandingHero keyPrefix={GENERAL_KEY_PREFIX} />
      <ProductShowcase keyPrefix={GENERAL_KEY_PREFIX} />
      <FlowsSection keyPrefix={GENERAL_KEY_PREFIX} />
      <MemoryStrip keyPrefix={GENERAL_KEY_PREFIX} />
      <KeepsakeSection keyPrefix={GENERAL_KEY_PREFIX} />
      <FinalDarkCTA keyPrefix={GENERAL_KEY_PREFIX} />
    </>
  );
};
