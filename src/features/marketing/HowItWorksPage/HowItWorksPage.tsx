import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/i18n/types";
import { HowItWorks } from "../landing/HowItWorks";
import { FinalCTA } from "../landing/FinalCTA";
import { PageBreadcrumbJsonLd } from "../components/PageBreadcrumbJsonLd";

export const HowItWorksPage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <>
      <PageBreadcrumbJsonLd
        locale={locale}
        page="how_it_works"
        path="/how-it-works"
      />
      <HowItWorks titleAs="h1" />
      <FinalCTA />
    </>
  );
};
