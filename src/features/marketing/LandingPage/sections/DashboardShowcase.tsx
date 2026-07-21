import { useTranslations } from "next-intl";
import { BrowserFrame } from "./BrowserFrame";
import { ShowcaseBullet } from "./ShowcaseBullet";

export const DashboardShowcase = () => {
  const t = useTranslations();

  return (
    <div className="tablet:grid-cols-2 grid grid-cols-1 items-center gap-14">
      <div>
        <p className="landing-eyebrow text-primary">
          {t("marketing__landing_b__dashboard_eyebrow")}
        </p>
        <h2 className="landing-h2 tablet:landing-h1 text-foreground mt-3">
          {t("marketing__landing_b__dashboard_title_line1")}{" "}
          <span className="text-primary italic">
            {t("marketing__landing_b__dashboard_title_line2")}
          </span>
          .
        </h2>
        <p className="landing-body-large text-muted-foreground mt-5">
          {t("marketing__landing_b__dashboard_description")}
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          <ShowcaseBullet>
            {t("marketing__landing_b__dashboard_bullet_1")}
          </ShowcaseBullet>
          <ShowcaseBullet>
            {t("marketing__landing_b__dashboard_bullet_2")}
          </ShowcaseBullet>
          <ShowcaseBullet>
            {t("marketing__landing_b__dashboard_bullet_3")}
          </ShowcaseBullet>
        </ul>
      </div>
      <div className="from-primary/20 to-warm-cream rounded-24 tablet:p-11 bg-linear-to-br p-8">
        <BrowserFrame
          url="🔒 ovationday.com"
          imageSrc="/images/dashboard.png"
          imageAlt={t("marketing__landing_b__dashboard_screenshot_label")}
        />
      </div>
    </div>
  );
};
