import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/i18n/types";
import { JsonLd } from "@/components/JsonLd";
import {
  faqPageSchema,
  linkItemListSchema,
  softwareApplicationSchema,
} from "@/lib/seo/schemas";
import { appUrl, localizedAbsoluteUrl } from "@/lib/seo/urls";
import { plansApi } from "@/lib/api/plans";
import type { Plan } from "@/lib/api/types";
import {
  COUPLE_PLAN_CODE,
  PRO_PLAN_CODE,
  STORAGE_EXTENSION_PLAN_CODE,
} from "@/features/marketing/pricingIds";
import {
  OCCASION_NAV_ITEMS,
  occasionSubtitleKey,
  occasionTitleKey,
} from "@/features/marketing/occasionNav";
import { GeneralHero } from "./general/sections/GeneralHero";
import { GENERAL_KEY_PREFIX } from "./variant";
import { FAQ_ITEM_KEYS } from "./constants";
import { FAQ_DRE_FALLBACK_PRICE } from "./general/sections/FaqSection/constants";

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
const PricingTeaser = dynamic(() =>
  import("./PricingTeaser").then((m) => ({ default: m.PricingTeaser })),
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

type LandingPrices = {
  couple: string;
  pro: string;
  dre: string;
};

const COUPLE_FALLBACK_PRICE = "€29";
const PRO_FALLBACK_PRICE = "€9";

const findPrice = (plans: Plan[], code: string, fallback: string): string => {
  const plan = plans.find((p) => p.code === code);
  return plan?.productVariables.regularPriceFormatted ?? fallback;
};

const fetchLandingPrices = async (): Promise<LandingPrices> => {
  try {
    const { plans } = await plansApi.publicList();
    return {
      couple: findPrice(plans, COUPLE_PLAN_CODE, COUPLE_FALLBACK_PRICE),
      pro: findPrice(plans, PRO_PLAN_CODE, PRO_FALLBACK_PRICE),
      dre: findPrice(
        plans,
        STORAGE_EXTENSION_PLAN_CODE,
        FAQ_DRE_FALLBACK_PRICE,
      ),
    };
  } catch {
    return {
      couple: COUPLE_FALLBACK_PRICE,
      pro: PRO_FALLBACK_PRICE,
      dre: FAQ_DRE_FALLBACK_PRICE,
    };
  }
};

export const GeneralLandingPage = async ({ params }: LocalePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, prices] = await Promise.all([
    getTranslations({ locale }),
    fetchLandingPrices(),
  ]);

  const faqItems = FAQ_ITEM_KEYS.map((item) => ({
    q: t(item.q),
    a: t(item.a, { drePrice: prices.dre }),
  }));

  const useCaseItems = OCCASION_NAV_ITEMS.filter((item) => !item.isCta).map(
    (item) => ({
      name: t(occasionTitleKey(item.key)),
      description: t(occasionSubtitleKey(item.key)),
      url: localizedAbsoluteUrl(locale, item.href),
    }),
  );

  const homeUrl = localizedAbsoluteUrl(locale, "/");

  return (
    <>
      <JsonLd data={faqPageSchema(faqItems)} />
      <JsonLd
        data={softwareApplicationSchema({
          name: "Ovation",
          description: t("seo__landing__description"),
          url: homeUrl,
          applicationCategory: "SocialNetworkingApplication",
          screenshot: `${appUrl}/images/general/gen-wedding-party.webp`,
        })}
      />
      <JsonLd
        data={linkItemListSchema(
          t("landing_general__occasions_title"),
          useCaseItems,
        )}
      />
      <GeneralHero />
      <StepStrip />
      <PhotoSharing />
      <HowItWorksSteps />
      <FeatureGrid />
      <OccasionGrid />
      <Comparison />
      <PricingTeaser couplePrice={prices.couple} proPrice={prices.pro} />
      <KeepsakeSection keyPrefix={GENERAL_KEY_PREFIX} />
      <FaqSection drePrice={prices.dre} />
    </>
  );
};
