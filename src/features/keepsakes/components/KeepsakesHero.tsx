import { useTranslations } from "next-intl";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";

export const KeepsakesHero = () => {
  const t = useTranslations();
  return (
    <div>
      <Eyebrow className="tracking-[2px] text-[#9A6B2F]">
        {t("keepsakes__hero__eyebrow")}
      </Eyebrow>
      <h1 className="tablet:type-display type-h1 mt-2.5 max-w-225 font-serif leading-none font-semibold tracking-tight">
        {t("keepsakes__hero__title_a")}
        <br />
        <span className="italic" style={{ color: "#C88C36" }}>
          {t("keepsakes__hero__title_b")}
        </span>
      </h1>
      <p className="type-body-small text-muted-foreground mt-3.5 max-w-155 leading-relaxed">
        {t("keepsakes__hero__subtitle")}
      </p>
    </div>
  );
};
