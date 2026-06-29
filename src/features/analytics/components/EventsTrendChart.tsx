"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@ovation/ui/components/Card";
import type { AccountAnalytics } from "@/lib/api/types";
import { formatMonthLabel } from "../utils/format";
import { ChartEmptyState } from "./ChartEmptyState";

type EventsTrendChartProps = {
  series: AccountAnalytics["series"]["eventsByMonth"];
};

export const EventsTrendChart = ({ series }: EventsTrendChartProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const data = series.map((point) => ({
    label: formatMonthLabel(point.month, locale),
    count: point.count,
  }));

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="type-body-small font-semibold">
        {t("analytics__charts__events_title")}
      </h3>
      {data.length === 0 ? (
        <ChartEmptyState />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip
                cursor={{ fill: "var(--color-muted)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--color-border)",
                  background: "var(--color-card)",
                  color: "var(--color-card-foreground)",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="count"
                fill="var(--color-primary)"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
