import { use } from "react";
import type { LocalePageProps } from "@/i18n/types";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@ovation/ui/components/Kicker";
import { PageBreadcrumbJsonLd } from "../components/PageBreadcrumbJsonLd";

export const AboutPage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} page="about" path="/about" />
      <section>
        <div className="section-container-small">
          <Kicker className="text-primary">
            {t("marketing__about__eyebrow")}
          </Kicker>
          <SectionTitle as="h1" className="mt-4 leading-none tracking-tighter">
            <span className="text-foreground block">
              {t("marketing__about__title_line1")}
            </span>
            <span className="text-primary block italic">
              {t("marketing__about__title_line2")}
            </span>
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__about__description")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <div className="border-border bg-card rounded-16 tablet:p-12 border p-8">
            <p className="text-muted-foreground type-body-small font-semibold tracking-widest uppercase">
              {t("marketing__about__mission_label")}
            </p>
            <blockquote className="text-foreground type-body-large mt-4 max-w-prose font-serif leading-relaxed italic">
              {t("marketing__about__mission")}
            </blockquote>
          </div>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <Kicker className="text-primary">
            {t("marketing__about__team_eyebrow")}
          </Kicker>
          <p className="text-muted-foreground type-body-large mt-4 max-w-130 leading-relaxed">
            {t("marketing__about__team_description")}
          </p>
          <p className="text-muted-foreground type-body-small mt-6">
            {t("marketing__about__founded")}
          </p>
        </div>
      </section>
    </>
  );
};
