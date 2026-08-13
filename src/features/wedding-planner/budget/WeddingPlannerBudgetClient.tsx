"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { Button } from "@ovation/ui/components/Button";
import { Card } from "@ovation/ui/components/Card";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { BellIcon } from "@ovation/icons/BellIcon";
import { TrashIcon } from "@ovation/icons/TrashIcon";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "@/components/Toaster";
import { ViewHeader } from "../components/ViewHeader";
import { ProgressRing } from "../components/ProgressRing";
import { FieldHint } from "../components/FieldHint";
import { money } from "../utils";
import {
  useCreateCategory,
  useCreatePayment,
  useDeleteCategory,
  useDeletePayment,
  useDeleteAllBudget,
  useSetBudgetTotal,
  useUpdateCategory,
  useUpdatePayment,
  useWeddingPlannerBudget,
} from "@/lib/query/weddingPlannerQueries";
import type { UpdateCategoryInput, UpdatePaymentInput } from "@/lib/api/types";
import { BudgetSnapshot } from "./BudgetSnapshot";
import { BudgetRow } from "./BudgetRow";
import { PaymentRow } from "./PaymentRow";
import { AddCategoryRow } from "./AddCategoryRow";
import { AddPaymentRow } from "./AddPaymentRow";
import { EditableAmount } from "./EditableAmount";

export const WeddingPlannerBudgetClient = ({
  eventId,
}: {
  eventId: string;
}) => {
  const t = useTranslations();
  const { data: budget, isLoading, isError } = useWeddingPlannerBudget(eventId);

  const setTotal = useSetBudgetTotal(eventId);
  const createCategory = useCreateCategory(eventId);
  const updateCategory = useUpdateCategory(eventId);
  const deleteCategory = useDeleteCategory(eventId);
  const createPayment = useCreatePayment(eventId);
  const updatePayment = useUpdatePayment(eventId);
  const deletePayment = useDeletePayment(eventId);

  const deleteAll = useDeleteAllBudget(eventId);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const categories = budget?.categories ?? [];
  const payments = budget?.payments ?? [];
  const totalBudget = budget?.totalBudget ?? 0;
  const hasBudget = categories.length > 0 || payments.length > 0;

  const confirmDeleteAll = () =>
    deleteAll.mutate(undefined, {
      onSuccess: () => {
        toast.success(t("wp__budget__delete_all_done"));
        setConfirmOpen(false);
      },
      onError: () => toast.error(t("wp__budget__delete_all_error")),
    });
  const paid = categories.reduce((sum, c) => sum + c.paid, 0);
  const actual = categories.reduce((sum, c) => sum + c.actual, 0);
  const estimated = categories.reduce((sum, c) => sum + c.estimated, 0);
  const spent = paid;
  const remaining = totalBudget - spent;
  const pctSpent =
    totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0;
  const over = totalBudget > 0 && estimated > totalBudget;

  const onRename = (categoryId: string, name: string) =>
    updateCategory.mutate({ categoryId, input: { name } });
  const onEditAmount = (
    categoryId: string,
    field: "estimated" | "actual" | "paid",
    value: number,
  ) =>
    updateCategory.mutate({
      categoryId,
      input: { [field]: value } as UpdateCategoryInput,
    });
  const onRemoveCategory = (categoryId: string) =>
    deleteCategory.mutate(categoryId);
  const onAddCategory = (name: string) => createCategory.mutate({ name });

  const onPayText = (
    paymentId: string,
    field: "vendor" | "label",
    value: string,
  ) =>
    updatePayment.mutate({
      paymentId,
      input: { [field]: value } as UpdatePaymentInput,
    });
  const onPayAmount = (paymentId: string, amount: number) =>
    updatePayment.mutate({ paymentId, input: { amount } });
  const onPayDue = (paymentId: string, dueDate: string | null) =>
    updatePayment.mutate({ paymentId, input: { dueDate } });
  const onRemovePayment = (paymentId: string) =>
    deletePayment.mutate(paymentId);
  const onAddPayment = (vendor: string) => createPayment.mutate({ vendor });

  const renderBody = () => {
    if (isLoading) {
      return (
        <p className="type-body-small text-muted-foreground">
          {t("wp__budget__loading")}
        </p>
      );
    }
    if (isError) {
      return (
        <p className="type-body-small text-destructive">
          {t("wp__budget__error")}
        </p>
      );
    }
    return (
      <div className="desktop:grid-cols-3 grid gap-5">
        <div className="desktop:col-span-2 flex flex-col gap-5">
          {categories.length > 0 ? (
            <BudgetSnapshot
              categories={categories}
              totalBudget={totalBudget}
              spent={spent}
              remaining={remaining}
            />
          ) : null}
          <Card className="overflow-hidden p-0">
            <div className="border-border type-overline text-muted-foreground grid grid-cols-12 gap-2 border-b px-5 py-3">
              <span className="col-span-4">
                {t("wp__budget__col_category")}
              </span>
              <span className="col-span-2 flex items-center gap-1">
                {t("wp__budget__col_estimated")}
                <FieldHint
                  ariaLabel={t("wp__budget__col_estimated")}
                  text={t("wp__budget__hint_estimated")}
                />
              </span>
              <span className="col-span-2 flex items-center gap-1">
                {t("wp__budget__col_actual")}
                <FieldHint
                  ariaLabel={t("wp__budget__col_actual")}
                  text={t("wp__budget__hint_actual")}
                />
              </span>
              <span className="col-span-2 flex items-center gap-1">
                {t("wp__budget__col_paid")}
                <FieldHint
                  ariaLabel={t("wp__budget__col_paid")}
                  text={t("wp__budget__hint_paid")}
                />
              </span>
              <span className="col-span-2">
                {t("wp__budget__col_progress")}
              </span>
            </div>
            {categories.map((category, index) => (
              <BudgetRow
                key={category.id}
                category={category}
                index={index}
                onRename={onRename}
                onEditAmount={onEditAmount}
                onRemove={onRemoveCategory}
              />
            ))}
            <div className="px-5 py-3">
              <AddCategoryRow onAdd={onAddCategory} />
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="border-border border-b px-5 py-3.5">
              <h3 className="type-h4">{t("wp__budget__payments")}</h3>
            </div>
            {payments.map((payment) => (
              <PaymentRow
                key={payment.id}
                payment={payment}
                onEditText={onPayText}
                onEditAmount={onPayAmount}
                onEditDue={onPayDue}
                onRemove={onRemovePayment}
              />
            ))}
            <div className="px-5 py-3">
              <AddPaymentRow onAdd={onAddPayment} />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card className="flex flex-col items-center">
            <ProgressRing
              pct={pctSpent}
              label={`${pctSpent}%`}
              sub={t("wp__budget__of_budget")}
              size={150}
            />
            <div className="mt-4 flex w-full flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="type-caption text-muted-foreground flex items-center gap-1">
                  {t("wp__budget__total")}
                  <FieldHint
                    ariaLabel={t("wp__budget__total")}
                    text={t("wp__budget__hint_total")}
                  />
                </span>
                <EditableAmount
                  value={totalBudget}
                  ariaLabel={t("wp__budget__total")}
                  onSave={(value) => setTotal.mutate(value)}
                  className="type-h4 text-primary"
                  iconClassName="text-primary"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="type-caption text-muted-foreground">
                  {t("wp__budget__paid")}
                </span>
                <span className="type-h4 text-secondary-foreground">
                  {money(paid)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="type-caption text-muted-foreground">
                  {t("wp__budget__outstanding")}
                </span>
                <span className="type-h4 text-primary">
                  {money(actual - paid)}
                </span>
              </div>
            </div>
          </Card>

          {totalBudget > 0 ? (
            <Card
              className={cn(
                over
                  ? "border-primary/40 bg-primary/5"
                  : "border-secondary/40 bg-secondary/15",
              )}
            >
              <div className="flex gap-3">
                <span
                  className={cn(
                    "shrink-0",
                    over ? "text-primary" : "text-secondary-foreground",
                  )}
                >
                  {over ? (
                    <BellIcon width={22} height={22} />
                  ) : (
                    <CheckIcon width={22} height={22} />
                  )}
                </span>
                <div>
                  <p className="type-body font-semibold">
                    {over ? t("wp__budget__over") : t("wp__budget__on_track")}
                  </p>
                  <p className="type-body-small text-muted-foreground mt-1">
                    {over
                      ? t("wp__budget__over_desc", {
                          amount: money(estimated - totalBudget),
                        })
                      : t("wp__budget__on_track_desc", {
                          amount: money(totalBudget - estimated),
                        })}
                  </p>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div>
      <ViewHeader
        title={t("wp__budget__title")}
        subtitle={t("wp__budget__sub", {
          spent: money(spent),
          total: money(totalBudget),
          remaining: money(remaining),
        })}
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfirmOpen(true)}
            disabled={!hasBudget}
          >
            <TrashIcon width={15} height={15} />
            {t("wp__budget__delete_all")}
          </Button>
        }
      />
      {renderBody()}
      <ConfirmDialog
        open={confirmOpen}
        title={t("wp__budget__delete_all_title")}
        description={t("wp__budget__delete_all_desc")}
        cancelLabel={t("wp__tasks__cancel")}
        confirmLabel={t("wp__budget__delete_all")}
        confirmTone="destructive"
        isPending={deleteAll.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDeleteAll}
      />
    </div>
  );
};
