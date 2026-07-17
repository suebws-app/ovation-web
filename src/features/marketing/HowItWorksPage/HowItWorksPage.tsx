import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/i18n/types";
import { HowItWorks } from "../LandingPage/HowItWorks";
import { FinalCTA } from "../LandingPage/FinalCTA";

export const HowItWorksPage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <>
      <HowItWorks titleAs="h1" />
      <FinalCTA />
    </>
  );
};
