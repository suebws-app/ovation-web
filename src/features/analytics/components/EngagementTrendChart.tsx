"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
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

type EngagementTrendChartProps = {
  series: AccountAnalytics["series"]["messagesByMonth"];
};

export const EngagementTrendChart = ({ series }: EngagementTrendChartProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const data = series.map((point) => ({
    label: formatMonthLabel(point.month, locale),
    count: point.count,
  }));

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="type-body-small font-semibold">
        {t("analytics__charts__messages_title")}
      </h3>
      {data.length === 0 ? (
        <ChartEmptyState />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            >
              <defs>
                <linearGradient id="engagementFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
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
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--color-border)",
                  background: "var(--color-card)",
                  color: "var(--color-card-foreground)",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#engagementFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
