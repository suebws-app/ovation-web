import { useTranslations } from "next-intl";
import { PageHeading } from "@/components/PageHeading";
import { KioskStatusCard } from "./KioskStatusCard";

type KioskHeroProps = {
  slug: string | null;
  fullscreenLock?: boolean;
};

export const KioskHero = ({ slug, fullscreenLock }: KioskHeroProps) => {
  const t = useTranslations();
  return (
    <div className="rounded-20 bg-card tablet:p-8 relative overflow-hidden p-4">
      <div className="bg-primary/10 absolute -top-10 -right-10 size-70 rounded-full" />
      <div className="desktop:grid-cols-[1fr_auto] desktop:gap-10 relative grid items-end gap-6">
        <div>
          <PageHeading kicker={t("kiosk__hero__eyebrow")}>
            {t("kiosk__hero__title_a")}{" "}
            <span className="text-primary italic">
              {t("kiosk__hero__title_b")}
            </span>
            .
          </PageHeading>
          <p className="type-body text-muted-foreground mt-3.5 max-w-xl">
            {t("kiosk__hero__subtitle")}
          </p>
        </div>

        <KioskStatusCard slug={slug} fullscreenLock={fullscreenLock} />
      </div>
    </div>
  );
};
