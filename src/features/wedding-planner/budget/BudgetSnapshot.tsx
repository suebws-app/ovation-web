"use client";

import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { Card } from "@ovation/ui/components/Card";
import { WalletIcon } from "@ovation/icons/WalletIcon";
import { chartColorVar, money } from "../utils";
import { DashBudgetSegment } from "../dashboard/DashBudgetSegment";
import { DashBudgetLegendItem } from "../dashboard/DashBudgetLegendItem";
import type { PlannerBudgetCategory } from "@/lib/api/types";

type BudgetSnapshotProps = {
  categories: PlannerBudgetCategory[];
  totalBudget: number;
  spent: number;
  remaining: number;
};

export const BudgetSnapshot = ({
  categories,
  totalBudget,
  spent,
  remaining,
}: BudgetSnapshotProps) => {
  const t = useTranslations();

  const valueOf = (category: PlannerBudgetCategory) =>
    category.actual || category.estimated || category.paid;
  const denominator = categories.reduce(
    (sum, category) => sum + valueOf(category),
    0,
  );

  const totals = [
    {
      label: t("wp__dash__budget"),
      value: totalBudget,
      className: "text-foreground",
    },
    { label: t("wp__dash__spent"), value: spent, className: "text-primary" },
    {
      label: t("wp__dash__remaining"),
      value: remaining,
      className: "text-secondary-foreground",
    },
  ];

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <WalletIcon width={20} height={20} className="text-primary" />
        <h3 className="type-h4">{t("wp__budget__snapshot")}</h3>
      </div>
      <div className="mb-4 flex gap-8">
        {totals.map((total) => (
          <div key={total.label}>
            <p className="type-caption text-muted-foreground">{total.label}</p>
            <p className={cn("type-h3 font-serif", total.className)}>
              {money(total.value)}
            </p>
          </div>
        ))}
      </div>
      <div className="border-border flex h-4 overflow-hidden rounded-full border">
        {categories.map((category, index) => (
          <DashBudgetSegment
            key={category.id}
            title={category.name}
            color={chartColorVar(index)}
            pct={denominator > 0 ? (valueOf(category) / denominator) * 100 : 0}
          />
        ))}
        <div className="bg-muted flex-1" />
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        {categories.slice(0, 5).map((category, index) => (
          <DashBudgetLegendItem
            key={category.id}
            label={category.name}
            color={chartColorVar(index)}
          />
        ))}
        {categories.length > 5 ? (
          <span className="type-caption text-muted-foreground">
            {t("wp__dash__more", { count: categories.length - 5 })}
          </span>
        ) : null}
      </div>
    </Card>
  );
};
