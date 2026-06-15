import { useTranslations } from "next-intl";
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

export const CookiesPage = () => {
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
    <section>
      <div className="section-container-small">
        <div className="max-w-prose">
          <h1 className="type-h0 text-foreground font-semibold">
            {t("marketing__cookies__title")}
          </h1>
          <p className="text-muted-foreground type-body-small mt-2">
            {t("marketing__cookies__last_updated")}
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
