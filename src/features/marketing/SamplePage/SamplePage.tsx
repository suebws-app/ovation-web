import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import type { LocalePageProps } from "@/i18n/types";
import { SampleSpread } from "../SampleSpread";

export const SamplePage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <SampleSpread />;
};
