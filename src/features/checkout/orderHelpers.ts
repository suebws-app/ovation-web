import type { OrderStatus } from "@/lib/api/types";

const STATUS_PROGRESS: Record<string, number> = {
  pending: 10,
  paid: 25,
  in_production: 60,
  shipped: 85,
  delivered: 100,
  failed: 0,
  refunded: 0,
  cancelled: 0,
};

const STATUS_TONE: Record<
  string,
  "primary" | "secondary" | "destructive" | "muted"
> = {
  pending: "muted",
  paid: "primary",
  in_production: "primary",
  shipped: "secondary",
  delivered: "secondary",
  failed: "destructive",
  refunded: "muted",
  cancelled: "muted",
};

const STATUS_LABEL_KEYS: Record<string, string> = {
  pending: "order__status__pending",
  paid: "order__status__paid",
  failed: "order__status__failed",
  refunded: "order__status__refunded",
  cancelled: "order__status__cancelled",
  in_production: "order__status__in_production",
  shipped: "order__status__shipped",
  delivered: "order__status__delivered",
};

export const statusKey = (status: OrderStatus): string =>
  STATUS_LABEL_KEYS[status] ?? "order__status__pending";

export const labelFor = (status: OrderStatus): string => statusKey(status);

export const progressFor = (status: OrderStatus): number =>
  STATUS_PROGRESS[status] ?? 0;

export const toneFor = (
  status: OrderStatus,
): "primary" | "secondary" | "destructive" | "muted" =>
  STATUS_TONE[status] ?? "muted";

export { formatMoney as formatPrice } from "@/lib/utils/currency";

export const formatOrderDate = (raw: string): string => {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
