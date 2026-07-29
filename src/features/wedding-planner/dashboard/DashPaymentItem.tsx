import { money } from "../utils";
import type { PlannerPayment } from "@/lib/api/types";

type DashPaymentItemProps = {
  payment: PlannerPayment;
  dueLabel: string;
};

export const DashPaymentItem = ({
  payment,
  dueLabel,
}: DashPaymentItemProps) => (
  <div className="flex items-center justify-between gap-3">
    <div className="min-w-0">
      <p className="type-body-small truncate font-medium">{payment.vendor}</p>
      <p className="type-caption text-muted-foreground">{dueLabel}</p>
    </div>
    <span className="type-h4 text-primary font-serif font-semibold">
      {money(payment.amount)}
    </span>
  </div>
);
