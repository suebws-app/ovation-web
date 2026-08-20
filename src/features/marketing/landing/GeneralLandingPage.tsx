import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/i18n/types";
import { GeneralHero } from "./general/sections/GeneralHero";
import { GENERAL_KEY_PREFIX } from "./variant";

const StepStrip = dynamic(() =>
  import("./general/sections/StepStrip").then((m) => ({
    default: m.StepStrip,
  })),
);
const PhotoSharing = dynamic(() =>
  import("./general/sections/PhotoSharing").then((m) => ({
    default: m.PhotoSharing,
  })),
);
const HowItWorksSteps = dynamic(() =>
  import("./general/sections/HowItWorksSteps").then((m) => ({
    default: m.HowItWorksSteps,
  })),
);
const FeatureGrid = dynamic(() =>
  import("./general/sections/FeatureGrid").then((m) => ({
    default: m.FeatureGrid,
  })),
);
const OccasionGrid = dynamic(() =>
  import("./general/sections/OccasionGrid").then((m) => ({
    default: m.OccasionGrid,
  })),
);
const Comparison = dynamic(() =>
  import("./general/sections/Comparison").then((m) => ({
    default: m.Comparison,
  })),
);
const FaqSection = dynamic(() =>
  import("./general/sections/FaqSection").then((m) => ({
    default: m.FaqSection,
  })),
);
const KeepsakeSection = dynamic(() =>
  import("./sections/KeepsakeSection").then((m) => ({
    default: m.KeepsakeSection,
  })),
);

export const GeneralLandingPage = async ({ params }: LocalePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <GeneralHero />
      <StepStrip />
      <PhotoSharing />
      <HowItWorksSteps />
      <FeatureGrid />
      <OccasionGrid />
      <Comparison />
      <KeepsakeSection keyPrefix={GENERAL_KEY_PREFIX} />
      <FaqSection />
    </>
  );
};
