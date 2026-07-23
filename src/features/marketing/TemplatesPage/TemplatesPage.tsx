import { getTranslations, setRequestLocale } from "next-intl/server";
import { Kicker } from "@ovation/ui/components/Kicker";
import { SectionTitle } from "@/components/SectionTitle";
import type { LocalePageProps } from "@/i18n/types";
import { PageBreadcrumbJsonLd } from "../components/PageBreadcrumbJsonLd";

export const TemplatesPage = async ({ params }: LocalePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <>
      <PageBreadcrumbJsonLd
        locale={locale}
        page="templates"
        path="/templates"
      />

      <section>
        <div className="section-container-small">
          <Kicker className="text-primary">
            {t("marketing__templates__eyebrow")}
          </Kicker>
          <SectionTitle as="h1" className="mt-4 tracking-tighter">
            {t("marketing__templates__title")}
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__templates__subtitle")}
          </p>
          <p className="text-muted-foreground type-body mt-10">
            {t("marketing__templates__coming_soon")}
          </p>
        </div>
      </section>
    </>
  );
};
