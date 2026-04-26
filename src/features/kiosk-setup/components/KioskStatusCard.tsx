"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Play } from "@ovation/icons/Play";
import { QrCode } from "@ovation/icons/QrCode";
import { Link } from "@/i18n/navigation";

type KioskStatusCardProps = {
  slug: string | null;
};

export const KioskStatusCard = ({ slug }: KioskStatusCardProps) => {
  const t = useTranslations();
  return (
    <div className="rounded-20 border-border bg-card w-85 border p-5.5 shadow">
      <div className="type-overline text-muted-foreground flex items-center gap-2.5">
        <span className="bg-muted-foreground/50 size-2 rounded-full" />
        {t("kiosk__hero__status_offline")}
      </div>
      <p className="type-h3 mt-2.5 font-serif leading-snug font-semibold tracking-tight">
        {t("kiosk__hero__status_lead")}
      </p>
      {slug ? (
        <Button asChild className="rounded-16 mt-4 w-full shadow-lg">
          <Link href={`/kiosk/${slug}`}>
            <Play width={14} height={14} />
            {t("kiosk__hero__start")}
          </Link>
        </Button>
      ) : (
        <Button disabled className="rounded-16 mt-4 w-full shadow-lg">
          <Play width={14} height={14} />
          {t("kiosk__hero__needs_event")}
        </Button>
      )}
      <div className="rounded-10 bg-background type-caption text-muted-foreground mt-3.5 flex items-center gap-2.5 p-3 leading-relaxed">
        <QrCode width={20} height={20} className="text-primary shrink-0" />
        {t("kiosk__hero__qr_hint")}
      </div>
    </div>
  );
};
