import { useTranslations } from "next-intl";
import { KioskStatusCard } from "./KioskStatusCard";

type KioskHeroProps = {
  slug: string | null;
  fullscreenLock?: boolean;
};

export const KioskHero = ({ slug, fullscreenLock }: KioskHeroProps) => {
  const t = useTranslations();
  return (
    <div className="rounded-20 bg-card tablet:p-10 desktop:p-12 relative overflow-hidden p-6">
      <div className="bg-primary/10 absolute -top-10 -right-10 size-70 rounded-full" />
      <div className="desktop:grid-cols-[1fr_auto] desktop:gap-10 relative grid items-end gap-6">
        <div>
          <span className="type-overline text-primary">
            {t("kiosk__hero__eyebrow")}
          </span>
          <h1 className="type-h0 mt-2.5 tracking-tight">
            {t("kiosk__hero__title_a")}{" "}
            <span className="text-primary italic">
              {t("kiosk__hero__title_b")}
            </span>
            .
          </h1>
          <p className="type-body text-muted-foreground mt-3.5 max-w-xl">
            {t("kiosk__hero__subtitle")}
          </p>
        </div>

        <KioskStatusCard slug={slug} fullscreenLock={fullscreenLock} />
      </div>
    </div>
  );
};
