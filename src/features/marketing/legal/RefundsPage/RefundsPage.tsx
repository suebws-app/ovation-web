import { use } from "react";
import type { LocalePageProps } from "@/i18n/types";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LegalSection } from "../LegalSection";
import { clientEnv } from "@/lib/utils/env.client";

const emailLink = (chunks: React.ReactNode) => (
  <a
    href={`mailto:${chunks}`}
    className="text-primary underline underline-offset-4"
  >
    {chunks}
  </a>
);

export const RefundsPage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();
  const supportEmail = clientEnv.SUPPORT_EMAIL;

  const sections = [
    {
      heading: t("marketing__refunds__intro_heading"),
      body: t("marketing__refunds__intro_body_v2"),
    },
    {
      heading: t("marketing__refunds__subscriptions_heading"),
      body: t("marketing__refunds__subscriptions_body"),
    },
    {
      heading: t("marketing__refunds__keepsakes_heading"),
      body: t("marketing__refunds__keepsakes_body_v2"),
    },
    {
      heading: t("marketing__refunds__how_heading"),
      body: t.rich("marketing__refunds__how_body_v2", {
        email: supportEmail,
        link: emailLink,
      }),
    },
  ];

  return (
    <section>
      <div className="section-container-small">
        <div className="max-w-prose">
          <h1 className="landing-h1 tablet:landing-display text-foreground">
            {t("marketing__refunds__title")}
          </h1>
          <p className="text-muted-foreground type-body-small mt-2">
            {t("marketing__refunds__last_updated")}
          </p>
          <div className="mt-10">
            {sections.map((s) => (
              <LegalSection key={s.heading} heading={s.heading} body={s.body} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
