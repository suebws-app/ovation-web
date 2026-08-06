"use client";

import { Button } from "@ovation/ui/components/Button";
import { HeartIcon } from "@ovation/icons/HeartIcon";
import { SparkleIcon } from "@ovation/icons/SparkleIcon";
import { LockIcon } from "@ovation/icons/LockIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useUpgradeModalStore } from "@/features/upgrade/useUpgradeModalStore";
import { daysUntil, formatLongDate } from "../utils";
import { formatDateRange } from "@/lib/event-types";

type CountdownHeroProps = {
  partners: string;
  venue: string | null;
  city: string | null;
  date: string | null;
  endDate?: string | null;
  daysLabel: string;
  askAiLabel: string;
  viewTimelineLabel: string;
  askAiLocked?: boolean;
};

export const CountdownHero = ({
  partners,
  venue,
  city,
  date,
  endDate,
  daysLabel,
  askAiLabel,
  viewTimelineLabel,
  askAiLocked = false,
}: CountdownHeroProps) => {
  const showUpgrade = useUpgradeModalStore((s) => s.show);
  const days = date ? daysUntil(date) : null;
  const heading = [partners, venue].filter(Boolean).join(" · ");
  const dateLabel = date
    ? formatDateRange(
        { eventDate: date, endDate: endDate ?? null, weddingDate: null },
        formatLongDate,
      )
    : null;
  const subline = [dateLabel, city].filter(Boolean).join(" · ");

  return (
    <div className="rounded-20 bg-primary text-primary-foreground tablet:p-8 relative overflow-hidden p-6">
      <HeartIcon className="pointer-events-none absolute -top-8 -right-8 size-50 opacity-10" />
      <p className="type-overline text-primary-foreground/80">{heading}</p>
      <div className="mt-4 flex items-baseline gap-4">
        <span className="type-display font-serif leading-none">
          {days ?? "—"}
        </span>
        <span className="type-h2 text-primary-foreground/85 font-serif italic">
          {daysLabel}
        </span>
      </div>
      {subline ? (
        <p className="type-body-small text-primary-foreground/70 mt-3">
          {subline}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {askAiLocked ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="text-primary-foreground"
            onClick={() => showUpgrade("assistant")}
          >
            <SparkleIcon width={15} height={15} />
            {askAiLabel}
            <LockIcon width={13} height={13} />
          </Button>
        ) : (
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="text-primary-foreground"
          >
            <Link href={appRoutes.app.weddingPlanner.assistant}>
              <SparkleIcon width={15} height={15} />
              {askAiLabel}
            </Link>
          </Button>
        )}
        <Button
          asChild
          size="sm"
          variant="pillGhost"
          className="text-primary-foreground border-primary-foreground/35 hover:bg-primary-foreground/10 bg-transparent"
        >
          <Link href={appRoutes.app.weddingPlanner.timeline}>
            {viewTimelineLabel}
          </Link>
        </Button>
      </div>
    </div>
  );
};
