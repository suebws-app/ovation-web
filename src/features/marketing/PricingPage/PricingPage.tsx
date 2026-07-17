import { setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/i18n/types";
import { PricingSection } from "../PricingSection";
import { FAQSection } from "../LandingPage/FAQSection";

export const PricingPage = async ({ params }: LocalePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PricingSection titleAs="h1" />
      <FAQSection />
    </>
  );
};
