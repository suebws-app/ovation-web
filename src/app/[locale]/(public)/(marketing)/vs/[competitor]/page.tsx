import type { Metadata } from "next";
import { locales } from "@/i18n/config";
import {
  COMPETITORS,
  CompetitorPage,
} from "@/features/marketing/CompetitorPage";
import { generateCompetitorMetadata } from "@/features/marketing/CompetitorPage/metadata";

interface Props {
  params: Promise<{ locale: string; competitor: string }>;
}

export const generateStaticParams = () =>
  locales.flatMap((locale) =>
    COMPETITORS.map((c) => ({ locale, competitor: c.slug })),
  );

export const generateMetadata = (props: Props): Promise<Metadata> =>
  generateCompetitorMetadata({ params: props.params, variant: "vs" });

const Page = (props: Props) => (
  <CompetitorPage params={props.params} variant="vs" />
);

export default Page;
