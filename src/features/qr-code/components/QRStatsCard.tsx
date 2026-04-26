"use client";

import { useTranslations } from "next-intl";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Sparkline } from "@ovation/illustrations/Sparkline";
import { QRStat } from "./QRStat";

export const QRStatsCard = () => {
  const t = useTranslations();
  const stats = [
    { value: "412", label: t("qr_code__stats__total_scans") },
    { value: "142", label: t("qr_code__stats__messages_recorded") },
    {
      value: "34%",
      label: t("qr_code__stats__scan_to_message"),
      positive: true,
    },
  ];
  return (
    <div className="rounded-16 border-border bg-card border p-4.5">
      <Eyebrow className="text-muted-foreground">
        {t("qr_code__stats__eyebrow")}
      </Eyebrow>
      <div className="mt-3.5 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <QRStat key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-3.5">
        <Sparkline />
        <div className="type-caption text-muted-foreground mt-1.5 flex justify-between">
          <span>{t("qr_code__stats__30_days_ago")}</span>
          <span>{t("qr_code__stats__today")}</span>
        </div>
      </div>
    </div>
  );
};
