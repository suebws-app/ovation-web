import { BookIcon } from "@ovation/icons/BookIcon";
import { QrCodeIcon } from "@ovation/icons/QrCodeIcon";
import { CartIcon } from "@ovation/icons/CartIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import type { Order, OrderStatus } from "@/lib/api/types";

type OrdersRowProps = {
  order: Order;
  productLabel: string;
  statusLabel: string;
  notFirst: boolean;
};

const formatPrice = (cents: number, currency: string): string =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);

const formatDateShort = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

const productIcon = (productType: string) => {
  if (productType.includes("qr") || productType.includes("card"))
    return <QrCodeIcon width={18} height={18} />;
  if (productType.includes("book") || productType.includes("vinyl"))
    return <BookIcon width={18} height={18} />;
  return <CartIcon width={18} height={18} />;
};

const iconTint = (productType: string): string => {
  if (productType.includes("qr") || productType.includes("card"))
    return "bg-primary/15 text-primary";
  if (productType.includes("book") || productType.includes("vinyl"))
    return "bg-accent/40 text-accent-foreground";
  return "bg-chart-4/20 text-chart-4";
};

const statusVisual = (
  status: OrderStatus,
): { className: string; withCheck: boolean } => {
  if (status === "delivered" || status === "shipped")
    return {
      className: "bg-chart-2/20 text-chart-2",
      withCheck: status === "delivered",
    };
  if (status === "in_production" || status === "paid")
    return { className: "bg-primary/15 text-primary", withCheck: false };
  if (status === "cancelled" || status === "failed" || status === "refunded")
    return {
      className: "bg-destructive/15 text-destructive",
      withCheck: false,
    };
  return { className: "bg-muted text-muted-foreground", withCheck: false };
};

const shortId = (id: string): string =>
  `#OV-${id.replace(/[^0-9]/g, "").slice(0, 4) || id.slice(0, 4).toUpperCase()}`;

export const OrdersRow = ({
  order,
  productLabel,
  statusLabel,
  notFirst,
}: OrdersRowProps) => {
  const visual = statusVisual(order.status);
  const productKey =
    `${order.productType} ${order.variantSku ?? ""}`.toLowerCase();

  return (
    <div
      className="flex items-center gap-4 py-4"
      style={{ borderTop: notFirst ? "1px solid var(--border)" : "none" }}
    >
      <span
        className={`${iconTint(productKey)} rounded-12 inline-flex size-10 shrink-0 items-center justify-center`}
      >
        {productIcon(productKey)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="type-body-small truncate font-serif font-semibold">
          {productLabel}
          {order.quantity > 1 && (
            <span className="text-muted-foreground ml-1 font-sans">
              ×{order.quantity}
            </span>
          )}
        </p>
        <p className="type-caption text-muted-foreground mt-0.5 truncate">
          {shortId(order.id)} · {formatDateShort(order.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <p className="type-body-small font-serif font-semibold">
          {formatPrice(order.totalCents, order.currency)}
        </p>
        <span
          className={`${visual.className} type-caption inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold`}
        >
          {visual.withCheck ? (
            <CheckIcon width={10} height={10} />
          ) : (
            <span className="inline-block size-1.5 rounded-full bg-current" />
          )}
          {statusLabel}
        </span>
      </div>
    </div>
  );
};
