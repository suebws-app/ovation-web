"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@ovation/ui/components/Tabs";
import type { AnalyticsRange } from "@/lib/api/types";

type AnalyticsRangeTabsProps = {
  value: AnalyticsRange;
  onChange: (range: AnalyticsRange) => void;
};

const RANGES: AnalyticsRange[] = ["30d", "90d", "all"];

export const AnalyticsRangeTabs = ({
  value,
  onChange,
}: AnalyticsRangeTabsProps) => {
  const t = useTranslations();
  const labels: Record<AnalyticsRange, string> = {
    "30d": t("analytics__range__30d"),
    "90d": t("analytics__range__90d"),
    all: t("analytics__range__all"),
  };

  return (
    <Tabs
      value={value}
      onValueChange={(next) => onChange(next as AnalyticsRange)}
    >
      <TabsList>
        {RANGES.map((range) => (
          <TabsTrigger key={range} value={range}>
            {labels[range]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
