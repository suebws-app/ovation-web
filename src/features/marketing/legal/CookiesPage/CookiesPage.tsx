import { use } from "react";
import type { LocalePageProps } from "@/i18n/types";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LegalSection } from "../LegalSection";
import { clientEnv } from "@/lib/utils/env.client";
import { PageBreadcrumbJsonLd } from "../../components/PageBreadcrumbJsonLd";

const emailLink = (chunks: React.ReactNode) => (
  <a
    href={`mailto:${chunks}`}
    className="text-primary underline underline-offset-4"
  >
    {chunks}
  </a>
);

export const CookiesPage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();
  const supportEmail = clientEnv.SUPPORT_EMAIL;

  const sections = [
    {
      heading: t("marketing__cookies__intro_heading"),
      body: t("marketing__cookies__intro_body"),
    },
    {
      heading: t("marketing__cookies__essential_heading"),
      body: t("marketing__cookies__essential_body"),
    },
    {
      heading: t("marketing__cookies__third_party_heading"),
      body: t("marketing__cookies__third_party_body"),
    },
    {
      heading: t("marketing__cookies__contact_heading"),
      body: t.rich("marketing__cookies__contact_body", {
        email: supportEmail,
        link: emailLink,
      }),
    },
  ];

  return (
    <>
      <PageBreadcrumbJsonLd
        locale={locale}
        page="legal_cookies"
        path="/legal/cookies"
      />
      <section>
        <div className="section-container-small">
          <div className="max-w-prose">
            <h1 className="landing-h1 tablet:landing-display text-foreground">
              {t("marketing__cookies__title")}
            </h1>
            <p className="text-muted-foreground type-body-small mt-2">
              {t("marketing__cookies__last_updated")}
            </p>
            <div className="mt-10">
              {sections.map((s) => (
                <LegalSection
                  key={s.heading}
                  heading={s.heading}
                  body={s.body}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
