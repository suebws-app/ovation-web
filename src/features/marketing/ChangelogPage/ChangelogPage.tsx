import { use } from "react";
import type { LocalePageProps } from "@/i18n/types";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@ovation/ui/components/Kicker";

export const ChangelogPage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  return (
    <>
      <section>
        <div className="section-container-small">
          <Kicker className="text-primary">
            {t("marketing__changelog__eyebrow")}
          </Kicker>
          <SectionTitle as="h1" className="mt-4">
            {t("marketing__changelog__title")}
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__changelog__description")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <p className="text-muted-foreground type-body max-w-prose leading-relaxed">
            {t("marketing__changelog__empty_state")}
          </p>
        </div>
      </section>
    </>
  );
};
