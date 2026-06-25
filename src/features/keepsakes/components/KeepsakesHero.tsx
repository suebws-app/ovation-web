import { useTranslations } from "next-intl";
import { PageHeading } from "@/components/PageHeading";

export const KeepsakesHero = () => {
  const t = useTranslations();
  return (
    <div>
      <PageHeading
        kicker={t("keepsakes__hero__eyebrow")}
        kickerClassName="tracking-[2px] text-[#9A6B2F]"
        className="max-w-225"
      >
        {t("keepsakes__hero__title_a")}
        <br />
        <span className="italic" style={{ color: "#C88C36" }}>
          {t("keepsakes__hero__title_b")}
        </span>
      </PageHeading>
      <p className="type-body-small text-muted-foreground mt-3.5 max-w-155 leading-relaxed">
        {t("keepsakes__hero__subtitle")}
      </p>
    </div>
  );
};
