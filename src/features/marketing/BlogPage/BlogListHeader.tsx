import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";

export const BlogListHeader = () => {
  const t = useTranslations();

  return (
    <section>
      <div className="section-container-small">
        <Kicker className="text-primary">
          {t("marketing__blog__list__kicker")}
        </Kicker>
        <h1 className="landing-h1 tablet:landing-display small-desktop:landing-hero mt-4 leading-none tracking-tight">
          <span className="text-foreground block">
            {t("marketing__blog__list__title_line1")}
          </span>
          <span className="text-primary block italic">
            {t("marketing__blog__list__title_line2")}
          </span>
        </h1>
        <p className="text-muted-foreground type-body-large mt-6 leading-relaxed">
          {t("marketing__blog__list__subtitle")}
        </p>
      </div>
    </section>
  );
};
