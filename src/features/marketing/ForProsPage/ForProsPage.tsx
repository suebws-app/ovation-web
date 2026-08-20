import { use } from "react";
import type { LocalePageProps } from "@/i18n/types";
import { setRequestLocale } from "next-intl/server";
import { PageBreadcrumbJsonLd } from "../components/PageBreadcrumbJsonLd";
import { ForProsHero } from "./ForProsHero";
import { ForProsFeatures } from "./ForProsFeatures";
import { BusinessSelector } from "./BusinessSelector";
import { ForProsPricing } from "./ForProsPricing";

export const ForProsPage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} page="for_pros" path="/for-pros" />
      <ForProsHero />
      <ForProsFeatures />
      <BusinessSelector />
      <ForProsPricing />
    </>
  );
};
