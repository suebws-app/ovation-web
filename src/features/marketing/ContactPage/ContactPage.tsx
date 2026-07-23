import { use } from "react";
import type { LocalePageProps } from "@/i18n/types";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@ovation/ui/components/Kicker";
import { ContactRow } from "./ContactRow";
import { CONTACT_ROW_KEYS } from "./constants";
import { PageBreadcrumbJsonLd } from "../components/PageBreadcrumbJsonLd";

export const ContactPage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  const rows = CONTACT_ROW_KEYS.map((k) => ({
    label: t(k.label),
    email: t(k.email),
  }));

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} page="contact" path="/contact" />
      <section>
        <div className="section-container-small">
          <Kicker className="text-primary">
            {t("marketing__contact__eyebrow")}
          </Kicker>
          <SectionTitle as="h1" className="mt-4">
            {t("marketing__contact__title")}
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__contact__description")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <div className="max-w-prose">
            {rows.map((row) => (
              <ContactRow key={row.label} label={row.label} email={row.email} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
