"use client";

import { useTranslations } from "next-intl";
import { XIcon } from "@ovation/icons/XIcon";
import { ProgressBar } from "../components/ProgressBar";
import { chartColorVar } from "../utils";
import { EditableText } from "./EditableText";
import { EditableAmount } from "./EditableAmount";
import type { PlannerBudgetCategory } from "@/lib/api/types";

type AmountField = "estimated" | "actual" | "paid";

type BudgetRowProps = {
  category: PlannerBudgetCategory;
  index: number;
  onRename: (categoryId: string, name: string) => void;
  onEditAmount: (categoryId: string, field: AmountField, value: number) => void;
  onRemove: (categoryId: string) => void;
};

export const BudgetRow = ({
  category,
  index,
  onRename,
  onEditAmount,
  onRemove,
}: BudgetRowProps) => {
  const t = useTranslations();
  const pctPaid = category.actual ? (category.paid / category.actual) * 100 : 0;
  const color = chartColorVar(index);

  return (
    <div className="group border-border/60 relative grid grid-cols-12 items-center gap-2 border-b px-5 py-3 last:border-0">
      <span className="col-span-4 flex min-w-0 items-center gap-2.5">
        <span
          className="rounded-4 size-2.5 shrink-0"
          style={{ backgroundColor: color }}
        />
        <EditableText
          value={category.name}
          ariaLabel={t("wp__budget__f_name")}
          onSave={(name) => onRename(category.id, name)}
          className="type-body-small min-w-0 font-medium"
          iconClassName="opacity-0 group-hover:opacity-100"
        />
      </span>
      <EditableAmount
        value={category.estimated}
        ariaLabel={t("wp__budget__col_estimated")}
        onSave={(value) => onEditAmount(category.id, "estimated", value)}
        className="type-body-small text-muted-foreground col-span-2"
        iconClassName="opacity-0 group-hover:opacity-100"
      />
      <EditableAmount
        value={category.actual}
        ariaLabel={t("wp__budget__col_actual")}
        onSave={(value) => onEditAmount(category.id, "actual", value)}
        className="type-body-small col-span-2 font-semibold"
        iconClassName="opacity-0 group-hover:opacity-100"
      />
      <EditableAmount
        value={category.paid}
        ariaLabel={t("wp__budget__col_paid")}
        onSave={(value) => onEditAmount(category.id, "paid", value)}
        className="type-body-small text-muted-foreground col-span-2"
        iconClassName="opacity-0 group-hover:opacity-100"
      />
      <div className="col-span-2 flex items-center gap-2 pr-5">
        <ProgressBar pct={pctPaid} fillColor={color} className="flex-1" />
        <span className="type-caption text-muted-foreground w-8 shrink-0">
          {Math.round(pctPaid)}%
        </span>
      </div>
      <button
        type="button"
        aria-label={t("wp__budget__remove_category")}
        onClick={() => onRemove(category.id)}
        className="text-muted-foreground hover:text-destructive absolute right-2 opacity-0 transition group-hover:opacity-100"
      >
        <XIcon width={15} height={15} />
      </button>
    </div>
  );
};
