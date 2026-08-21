import { useTranslations } from "next-intl";
import { BrowserFrame } from "./BrowserFrame";
import { ShowcaseBullet } from "./ShowcaseBullet";
import { WEDDING_KEY_PREFIX } from "../variant";

type DashboardShowcaseProps = {
  keyPrefix?: string;
};

export const DashboardShowcase = ({
  keyPrefix = WEDDING_KEY_PREFIX,
}: DashboardShowcaseProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${keyPrefix}${suffix}`);

  return (
    <div className="tablet:grid-cols-2 grid grid-cols-1 items-center gap-14">
      <div>
        <p className="landing-eyebrow text-primary">{k("dashboard_eyebrow")}</p>
        <h2 className="landing-h2 tablet:landing-h1 text-foreground mt-3">
          {k("dashboard_title_line1")}{" "}
          <span className="text-primary italic">
            {k("dashboard_title_line2")}
          </span>
          .
        </h2>
        <p className="landing-body-large text-muted-foreground mt-5">
          {k("dashboard_description")}
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          <ShowcaseBullet>{k("dashboard_bullet_1")}</ShowcaseBullet>
          <ShowcaseBullet>{k("dashboard_bullet_2")}</ShowcaseBullet>
          <ShowcaseBullet>{k("dashboard_bullet_3")}</ShowcaseBullet>
        </ul>
      </div>
      <div className="from-primary/20 to-warm-cream rounded-24 tablet:p-11 bg-linear-to-br p-8">
        <BrowserFrame
          url="🔒 ovationday.com"
          imageSrc="/images/dashboard.webp"
          imageAlt={k("dashboard_screenshot_label")}
        />
      </div>
    </div>
  );
};
