import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { SectionTitle } from "../../../components/SectionTitle";

export const BlogListHeader = () => {
  const t = useTranslations();

  return (
    <section>
      <div className="section-container-small">
        <Kicker className="text-primary">
          {t("marketing__blog__list__kicker")}
        </Kicker>
        <SectionTitle as="h1" className="mt-4 leading-none tracking-tighter">
          <span className="text-foreground block">
            {t("marketing__blog__list__title_line1")}
          </span>
          <span className="text-primary block italic">
            {t("marketing__blog__list__title_line2")}
          </span>
        </SectionTitle>
        <p className="text-muted-foreground type-body-large mt-6 leading-relaxed">
          {t("marketing__blog__list__subtitle")}
        </p>
      </div>
    </section>
  );
};
