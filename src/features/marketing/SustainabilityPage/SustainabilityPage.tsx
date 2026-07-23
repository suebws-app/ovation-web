import { use } from "react";
import type { LocalePageProps } from "@/i18n/types";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@ovation/ui/components/Kicker";
import { SustainabilityCommitment } from "./SustainabilityCommitment";
import { SUSTAINABILITY_COMMITMENT_KEYS } from "./constants";
import { PageBreadcrumbJsonLd } from "../components/PageBreadcrumbJsonLd";

export const SustainabilityPage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  const commitments = SUSTAINABILITY_COMMITMENT_KEYS.map((k) => ({
    title: t(k.title),
    body: t(k.body),
  }));

  return (
    <>
      <PageBreadcrumbJsonLd
        locale={locale}
        page="sustainability"
        path="/sustainability"
      />
      <section>
        <div className="section-container-small">
          <Kicker className="text-primary">
            {t("marketing__sustainability__eyebrow")}
          </Kicker>
          <SectionTitle as="h1" className="mt-4 leading-none tracking-tighter">
            <span className="text-foreground block">
              {t("marketing__sustainability__title_line1")}
            </span>
            <span className="text-primary block italic">
              {t("marketing__sustainability__title_line2")}
            </span>
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__sustainability__description")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <div className="tablet:grid-cols-2 grid grid-cols-1 gap-6">
            {commitments.map((c) => (
              <SustainabilityCommitment
                key={c.title}
                title={c.title}
                body={c.body}
              />
            ))}
          </div>
          <p className="text-muted-foreground type-body-small mt-10 max-w-prose leading-relaxed">
            {t("marketing__sustainability__footer_note")}
          </p>
        </div>
      </section>
    </>
  );
};
