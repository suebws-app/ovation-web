import { locales } from "@/i18n/config";
import { EVENT_TYPE_PAGES } from "@/features/marketing/EventTypePage";
import { USE_CASES } from "@/features/marketing/UseCasePage";

export { generateUseCaseRouteMetadata as generateMetadata } from "@/features/marketing/UseCaseRoute/metadata";

export const generateStaticParams = () => {
  const slugs = [
    ...EVENT_TYPE_PAGES.map((page) => page.slug),
    ...USE_CASES.map((useCase) => useCase.slug),
  ];
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, case: slug })),
  );
};

export { UseCaseRoute as default } from "@/features/marketing/UseCaseRoute";
