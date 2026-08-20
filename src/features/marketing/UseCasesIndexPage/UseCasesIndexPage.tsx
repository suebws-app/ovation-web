import { use } from "react";
import type { LocalePageProps } from "@/i18n/types";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Kicker } from "@ovation/ui/components/Kicker";
import { SectionTitle } from "@/components/SectionTitle";
import { PageBreadcrumbJsonLd } from "@/features/marketing/components/PageBreadcrumbJsonLd";
import { EVENT_TYPE_PAGES } from "@/features/marketing/EventTypePage";
import { USE_CASES } from "@/features/marketing/UseCasePage";
import { UseCaseIndexCard } from "./UseCaseIndexCard";

export const UseCasesIndexPage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  const occasions = EVENT_TYPE_PAGES.map((page) => {
    const base = `marketing__event_type__${page.slug}`;
    return {
      key: page.slug,
      href: `/use-cases/${page.slug}`,
      title: t(`${base}__title`),
      description: t.has(`${base}__tagline`)
        ? t(`${base}__tagline`)
        : t(`et__${page.eventType}__tagline`),
    };
  });

  const features = USE_CASES.map((useCase) => ({
    key: useCase.slug,
    href: `/use-cases/${useCase.slug}`,
    title: t(`marketing__use_case__${useCase.slug}__title`),
    description: t(`marketing__use_case__${useCase.slug}__subtitle`),
  }));

  return (
    <>
      <PageBreadcrumbJsonLd
        locale={locale}
        page="use_cases_index"
        path="/use-cases"
      />

      <section>
        <div className="section-container-small">
          <Kicker className="text-primary">
            {t("marketing__use_cases_index__eyebrow")}
          </Kicker>
          <SectionTitle as="h1" className="mt-4 tracking-tighter">
            {t("marketing__use_cases_index__title")}
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-160 leading-relaxed">
            {t("marketing__use_cases_index__subtitle")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <h2 className="landing-h2 text-foreground">
            {t("marketing__use_cases_index__occasions_heading")}
          </h2>
          <div className="tablet:grid-cols-2 desktop:grid-cols-4 mt-8 grid grid-cols-1 gap-5">
            {occasions.map((item) => (
              <UseCaseIndexCard
                key={item.key}
                href={item.href}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <h2 className="landing-h2 text-foreground">
            {t("marketing__use_cases_index__features_heading")}
          </h2>
          <div className="tablet:grid-cols-2 desktop:grid-cols-3 mt-8 grid grid-cols-1 gap-5">
            {features.map((item) => (
              <UseCaseIndexCard
                key={item.key}
                href={item.href}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
