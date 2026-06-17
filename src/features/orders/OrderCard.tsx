"use client";

import { useTranslations } from "next-intl";
import type { Order } from "@/lib/api/types";
import { translateKey } from "@/lib/utils/translateKey";
import { formatVariantName } from "@/lib/utils/formatVariantName";
import {
  formatOrderDate,
  formatPrice,
  progressFor,
} from "@/features/checkout/orderHelpers";

type OrderCardProps = {
  order: Order;
  statusLabel: string;
  photoCountLabel: string | null;
  onClick: () => void;
};

const colorFor = (status: string): string => {
  if (status === "delivered") return "var(--secondary)";
  if (status === "shipped" || status === "in_production")
    return "var(--accent)";
  if (status === "paid" || status === "pending") return "var(--primary)";
  return "var(--muted-foreground)";
};

export const OrderCard = ({
  order,
  statusLabel,
  photoCountLabel,
  onClick,
}: OrderCardProps) => {
  const t = useTranslations();
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-16 border-border bg-card hover:bg-muted/40 flex w-full flex-col gap-3 border p-4 text-left transition-colors"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="type-body-small font-semibold">
            {translateKey(t, order.productName)}
            {formatVariantName(order.variantName)
              ? ` — ${formatVariantName(order.variantName)}`
              : ""}
          </span>
          <span className="type-caption text-muted-foreground">
            {formatOrderDate(order.createdAt)} · #{order.id.slice(0, 8)}
          </span>
        </div>
        <span className="type-body-small font-mono">
          {formatPrice(order.totalCents, order.currency)}
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <span className="type-caption text-muted-foreground">
          {statusLabel}
        </span>
        {photoCountLabel && (
          <span className="type-caption text-muted-foreground">
            {photoCountLabel}
          </span>
        )}
      </div>

      <div className="bg-border h-1 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progressFor(order.status)}%`,
            background: colorFor(order.status),
          }}
        />
      </div>
    </button>
  );
};
