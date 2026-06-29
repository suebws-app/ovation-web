"use client";

import { useTranslations } from "next-intl";
import { Card } from "@ovation/ui/components/Card";
import { cn } from "@ovation/ui/utils/cn";
import type { AccountAnalytics } from "@/lib/api/types";

type EventStatusBreakdownProps = {
  events: AccountAnalytics["events"];
};

const STATUS_TONE: Record<string, string> = {
  active: "bg-primary",
  draft: "bg-muted-foreground/50",
  paused: "bg-accent",
  archived: "bg-muted-foreground/30",
};

export const EventStatusBreakdown = ({ events }: EventStatusBreakdownProps) => {
  const t = useTranslations();
  const rows: { key: keyof AccountAnalytics["events"]; label: string }[] = [
    { key: "active", label: t("analytics__status__active") },
    { key: "draft", label: t("analytics__status__draft") },
    { key: "paused", label: t("analytics__status__paused") },
    { key: "archived", label: t("analytics__status__archived") },
  ];
  const total = events.total || 1;

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="type-body-small font-semibold">
        {t("analytics__status__title")}
      </h3>
      <div className="flex flex-col gap-3">
        {rows.map((row) => {
          const value = events[row.key];
          const pct = Math.round((value / total) * 100);
          return (
            <div key={row.key} className="flex flex-col gap-1.5">
              <div className="type-caption flex items-center justify-between">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-semibold">{value}</span>
              </div>
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className={cn("h-full rounded-full", STATUS_TONE[row.key])}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
