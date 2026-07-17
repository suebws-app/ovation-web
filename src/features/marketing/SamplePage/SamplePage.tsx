import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { AudioPlayerProvider } from "@ovation/ui/providers/AudioPlayerProvider";
import type { LocalePageProps } from "@/i18n/types";
import { SampleSpread } from "../SampleSpread";

export const SamplePage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <AudioPlayerProvider>
      <SampleSpread titleAs="h1" />
    </AudioPlayerProvider>
  );
};
