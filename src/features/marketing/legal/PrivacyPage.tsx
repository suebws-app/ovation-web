import { useTranslations } from "next-intl";
import { LegalSection } from "./LegalSection";
import { clientEnv } from "@/lib/utils/env.client";

const emailLink = (chunks: React.ReactNode) => (
  <a
    href={`mailto:${chunks}`}
    className="text-primary underline underline-offset-4"
  >
    {chunks}
  </a>
);

export const PrivacyPage = () => {
  const t = useTranslations();
  const supportEmail = clientEnv.SUPPORT_EMAIL;

  const sections = [
    {
      heading: t("marketing__privacy__intro_heading"),
      body: t("marketing__privacy__intro_body"),
    },
    {
      heading: t("marketing__privacy__collect_heading"),
      body: t("marketing__privacy__collect_body"),
    },
    {
      heading: t("marketing__privacy__use_heading"),
      body: t("marketing__privacy__use_body"),
    },
    {
      heading: t("marketing__privacy__share_heading"),
      body: t("marketing__privacy__share_body"),
    },
    {
      heading: t("marketing__privacy__rights_heading"),
      body: t.rich("marketing__privacy__rights_body", {
        email: supportEmail,
        link: emailLink,
      }),
    },
  ];

  return (
    <section>
      <div className="section-container-small">
        <div className="max-w-prose">
          <h1 className="tablet:type-h0 text-foreground type-h1 font-semibold">
            {t("marketing__privacy__title")}
          </h1>
          <p className="text-muted-foreground type-body-small mt-2">
            {t("marketing__privacy__last_updated")}
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
