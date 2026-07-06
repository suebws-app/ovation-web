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

export const TermsPage = () => {
  const t = useTranslations();
  const supportEmail = clientEnv.SUPPORT_EMAIL;
  const legalEntity = {
    legalEntityName: clientEnv.LEGAL_ENTITY_NAME,
    legalEntityAddress: clientEnv.LEGAL_ENTITY_ADDRESS,
  };

  const sections = [
    {
      heading: t("marketing__terms__intro_heading"),
      body: t("marketing__terms__intro_body", legalEntity),
    },
    {
      heading: t("marketing__terms__service_heading"),
      body: t("marketing__terms__service_body"),
    },
    {
      heading: t("marketing__terms__content_heading"),
      body: t("marketing__terms__content_body"),
    },
    {
      heading: t("marketing__terms__acceptable_use_heading"),
      body: t("marketing__terms__acceptable_use_body"),
    },
    {
      heading: t("marketing__terms__payments_heading"),
      body: t("marketing__terms__payments_body"),
    },
    {
      heading: t("marketing__terms__keepsakes_heading"),
      body: t("marketing__terms__keepsakes_body"),
    },
    {
      heading: t("marketing__terms__storage_heading"),
      body: t("marketing__terms__storage_body"),
    },
    {
      heading: t("marketing__terms__ip_heading"),
      body: t("marketing__terms__ip_body", legalEntity),
    },
    {
      heading: t("marketing__terms__copyright_heading"),
      body: t.rich("marketing__terms__copyright_body", {
        email: supportEmail,
        link: emailLink,
      }),
    },
    {
      heading: t("marketing__terms__liability_heading"),
      body: t("marketing__terms__liability_body"),
    },
    {
      heading: t("marketing__terms__termination_heading"),
      body: t("marketing__terms__termination_body"),
    },
    {
      heading: t("marketing__terms__law_heading"),
      body: t("marketing__terms__law_body"),
    },
    {
      heading: t("marketing__terms__changes_heading"),
      body: t("marketing__terms__changes_body"),
    },
    {
      heading: t("marketing__terms__contact_heading"),
      body: t.rich("marketing__terms__contact_body", {
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
            {t("marketing__terms__title")}
          </h1>
          <p className="text-muted-foreground type-body-small mt-2">
            {t("marketing__terms__last_updated")}
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
