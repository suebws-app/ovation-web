import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { AudioPlayerProvider } from "@ovation/ui/providers/AudioPlayerProvider";
import type { LocalePageProps } from "@/i18n/types";
import { SampleSpread } from "../SampleSpread";
import { PageBreadcrumbJsonLd } from "../components/PageBreadcrumbJsonLd";

export const SamplePage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} page="sample" path="/sample" />
      <AudioPlayerProvider>
        <SampleSpread titleAs="h1" />
      </AudioPlayerProvider>
    </>
  );
};
