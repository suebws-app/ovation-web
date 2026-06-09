import { useTranslations } from "next-intl";
import { CartIcon } from "@ovation/icons/CartIcon";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { Order, OrderStatus } from "@/lib/api/types";
import { OrdersRow } from "./OrdersRow";

type OrdersProps = {
  orders: Order[];
};

const STATUS_KEY: Record<string, string> = {
  pending: "dashboard__widget__orders__status__pending",
  paid: "dashboard__widget__orders__status__paid",
  in_production: "dashboard__widget__orders__status__in_production",
  shipped: "dashboard__widget__orders__status__shipped",
  delivered: "dashboard__widget__orders__status__delivered",
  cancelled: "dashboard__widget__orders__status__cancelled",
  refunded: "dashboard__widget__orders__status__refunded",
  failed: "dashboard__widget__orders__status__failed",
};

const statusLabel = (
  status: OrderStatus,
  t: (key: string) => string,
): string => {
  const key = STATUS_KEY[status];
  return key ? t(key) : status;
};

export const Orders = ({ orders }: OrdersProps) => {
  const t = useTranslations();
  const visible = orders.slice(0, 3);

  return (
    <div className="rounded-20 border-border bg-card flex flex-col border p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 pb-4">
        <div className="flex items-center gap-3">
          <span className="bg-chart-4/20 text-chart-4 rounded-12 inline-flex size-10 items-center justify-center">
            <CartIcon width={18} height={18} />
          </span>
          <div>
            <p className="type-body font-serif font-semibold">
              {t("dashboard__widget__orders__title")}
            </p>
            <p className="type-caption text-muted-foreground">
              {t("dashboard__widget__orders__subtitle")}
            </p>
          </div>
        </div>
        <Link
          href={appRoutes.app.orders}
          className="type-body-small text-primary inline-flex shrink-0 items-center gap-1 font-semibold hover:underline"
        >
          {t("dashboard__widget__orders__view_all")}
          <ArrowRightIcon width={12} height={12} />
        </Link>
      </div>

      {visible.length === 0 ? (
        <p className="type-body-small text-muted-foreground border-border border-t py-4">
          {t("dashboard__widget__orders__empty")}
        </p>
      ) : (
        <div className="flex flex-col">
          {visible.map((order, index) => (
            <OrdersRow
              key={order.id}
              order={order}
              statusLabel={statusLabel(order.status, t)}
              notFirst={index > 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};
