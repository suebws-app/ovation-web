import { locales } from "@/i18n/config";
import { USE_CASES, UseCasePage } from "@/features/marketing/UseCasePage";

export { generateUseCaseMetadata as generateMetadata } from "@/features/marketing/UseCasePage/metadata";

export const generateStaticParams = () =>
  locales.flatMap((locale) =>
    USE_CASES.map((useCase) => ({ locale, case: useCase.slug })),
  );

export { UseCasePage as default };
