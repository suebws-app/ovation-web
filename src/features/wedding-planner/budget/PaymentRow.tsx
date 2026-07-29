"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import { Calendar } from "@ovation/ui/components/DatePicker";
import { CalendarIcon } from "@ovation/icons/CalendarIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { EditableText } from "./EditableText";
import { EditableAmount } from "./EditableAmount";
import { formatShortDate } from "../utils";
import type { PlannerPayment } from "@/lib/api/types";

type PaymentRowProps = {
  payment: PlannerPayment;
  onEditText: (
    paymentId: string,
    field: "vendor" | "label",
    value: string,
  ) => void;
  onEditAmount: (paymentId: string, value: number) => void;
  onEditDue: (paymentId: string, dueDate: string | null) => void;
  onRemove: (paymentId: string) => void;
};

export const PaymentRow = ({
  payment,
  onEditText,
  onEditAmount,
  onEditDue,
  onRemove,
}: PaymentRowProps) => {
  const t = useTranslations();
  const [dateOpen, setDateOpen] = useState(false);
  const selected = payment.dueDate ? new Date(payment.dueDate) : undefined;

  return (
    <div className="group border-border/60 relative grid grid-cols-12 items-center gap-2 border-b px-5 py-3 last:border-0">
      <EditableText
        value={payment.vendor}
        ariaLabel={t("wp__budget__pay_vendor")}
        onSave={(value) => onEditText(payment.id, "vendor", value)}
        className="type-body-small col-span-4 min-w-0 font-medium"
        iconClassName="opacity-0 group-hover:opacity-100"
      />
      <EditableText
        value={payment.label ?? ""}
        ariaLabel={t("wp__budget__pay_label")}
        placeholder={t("wp__budget__pay_label")}
        onSave={(value) => onEditText(payment.id, "label", value)}
        className="type-body-small text-muted-foreground col-span-3 min-w-0"
        iconClassName="opacity-0 group-hover:opacity-100"
      />
      <EditableAmount
        value={payment.amount}
        ariaLabel={t("wp__budget__pay_amount")}
        onSave={(value) => onEditAmount(payment.id, value)}
        className="type-body-small col-span-2 font-semibold"
        iconClassName="opacity-0 group-hover:opacity-100"
      />
      <div className="col-span-3 pr-5">
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5"
            >
              <CalendarIcon width={14} height={14} className="shrink-0" />
              <span
                className={cn(
                  "type-caption",
                  selected ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {selected
                  ? formatShortDate(payment.dueDate!)
                  : t("wp__budget__pay_due")}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={8}
            className="rounded-16 w-auto p-3"
          >
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(date) => {
                onEditDue(
                  payment.id,
                  date ? date.toISOString().slice(0, 10) : null,
                );
                setDateOpen(false);
              }}
              className="mx-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      <button
        type="button"
        aria-label={t("wp__budget__remove_payment")}
        onClick={() => onRemove(payment.id)}
        className="text-muted-foreground hover:text-destructive absolute right-2 opacity-0 transition group-hover:opacity-100"
      >
        <XIcon width={15} height={15} />
      </button>
    </div>
  );
};
