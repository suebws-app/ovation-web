"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { FeaturePageLayout } from "@/components/FeaturePageLayout";
import type { AccountAnalytics, AnalyticsRange } from "@/lib/api/types";
import { useAccountAnalytics } from "@/lib/query/analyticsQueries";
import { AnalyticsRangeTabs } from "./components/AnalyticsRangeTabs";
import { AnalyticsStatGrid } from "./components/AnalyticsStatGrid";
import { EventStatusBreakdown } from "./components/EventStatusBreakdown";
import { AnalyticsSkeleton } from "./components/AnalyticsSkeleton";

const EventsTrendChart = dynamic(
  () => import("./components/EventsTrendChart").then((m) => m.EventsTrendChart),
  { ssr: false },
);
const EngagementTrendChart = dynamic(
  () =>
    import("./components/EngagementTrendChart").then(
      (m) => m.EngagementTrendChart,
    ),
  { ssr: false },
);

type AnalyticsPageClientProps = {
  initialData?: AccountAnalytics;
};

export const AnalyticsPageClient = ({
  initialData,
}: AnalyticsPageClientProps) => {
  const t = useTranslations();
  const [range, setRange] = useState<AnalyticsRange>("all");
  const { data, isError, isPending } = useAccountAnalytics(range, initialData);

  return (
    <FeaturePageLayout>
      <div className="flex flex-col gap-1">
        <h1 className="type-h2 font-serif font-semibold">
          {t("analytics__title")}
        </h1>
        <p className="type-body-small text-muted-foreground">
          {t("analytics__subtitle")}
        </p>
      </div>

      <div className="flex justify-end">
        <AnalyticsRangeTabs value={range} onChange={setRange} />
      </div>

      {isError ? (
        <div className="text-muted-foreground type-body-small border-border rounded-16 border border-dashed p-8 text-center">
          {t("analytics__error")}
        </div>
      ) : isPending || !data ? (
        <AnalyticsSkeleton />
      ) : (
        <div className="flex flex-col gap-4">
          <AnalyticsStatGrid data={data} />
          <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
            <EventsTrendChart series={data.series.eventsByMonth} />
            <EngagementTrendChart series={data.series.messagesByMonth} />
          </div>
          <EventStatusBreakdown events={data.events} />
        </div>
      )}
    </FeaturePageLayout>
  );
};
