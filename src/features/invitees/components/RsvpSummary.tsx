"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import type { Invitee } from "@/lib/api/types";
import {
  computeRsvpSummary,
  type RsvpSummary as RsvpSummaryData,
} from "./computeRsvpSummary";
import { RsvpDonut } from "./RsvpDonut";

const COMING_COLOR = "#10b981";
const DECLINED_COLOR = "var(--destructive)";
const PENDING_COLOR = "var(--muted-foreground)";

type LegendRow = {
  key: "accepted" | "declined" | "pending";
  color: string;
  bucket: RsvpSummaryData["coming"];
};

type RsvpSummaryProps = {
  invitees: Invitee[];
  orientation?: "stacked" | "row";
  className?: string;
};

export const RsvpSummary = ({
  invitees,
  orientation = "stacked",
  className,
}: RsvpSummaryProps) => {
  const t = useTranslations();
  const summary = useMemo(() => computeRsvpSummary(invitees), [invitees]);

  const rows: LegendRow[] = [
    { key: "accepted", color: COMING_COLOR, bucket: summary.coming },
    { key: "declined", color: DECLINED_COLOR, bucket: summary.declined },
    { key: "pending", color: PENDING_COLOR, bucket: summary.notAnswered },
  ];

  return (
    <div
      className={cn(
        "rounded-16 border-border bg-card w-full border p-5",
        className,
      )}
    >
      <h2 className="type-h4 mb-4">{t("invitees__rsvp_summary__title")}</h2>
      {summary.totalEntries === 0 ? (
        <p className="type-body-small text-muted-foreground">
          {t("invitees__rsvp_summary__empty")}
        </p>
      ) : (
        <div
          className={
            orientation === "row"
              ? "tablet:flex-row flex flex-col items-center gap-6"
              : "flex flex-col items-center gap-6"
          }
        >
          <div className="flex flex-col items-center gap-2">
            <RsvpDonut
              total={summary.totalHeads}
              segments={[
                { value: summary.coming.heads, color: COMING_COLOR },
                { value: summary.declined.heads, color: DECLINED_COLOR },
                { value: summary.notAnswered.heads, color: PENDING_COLOR },
              ]}
            >
              <span className="type-h1 font-serif leading-none">
                {summary.coming.heads}
              </span>
              <span className="type-overline text-muted-foreground mt-1">
                {t("invitees__rsvp_summary__coming")}
              </span>
            </RsvpDonut>
            <span className="type-caption text-muted-foreground">
              {t("invitees__rsvp_summary__entries", {
                coming: summary.coming.entries,
                total: summary.totalEntries,
              })}
            </span>
          </div>
          <ul className="flex w-full flex-col gap-3">
            {rows.map((row) => (
              <li key={row.key} className="flex items-center gap-3">
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ background: row.color }}
                />
                <span className="type-body-small flex-1">
                  {t(`invitees__rsvp__${row.key}`)}
                </span>
                <span className="type-body-small font-medium">
                  {row.bucket.heads}
                </span>
                <span className="type-caption text-muted-foreground w-10 text-right">
                  {row.bucket.pct}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
