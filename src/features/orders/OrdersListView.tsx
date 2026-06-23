"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { FeaturePageLayout } from "@/components/FeaturePageLayout";
import { PageHeading } from "@/components/PageHeading";
import { useOrdersList } from "@/lib/query/ordersQueries";
import { OrderDetailModal } from "@/features/keepsakes/components/OrderDetailModal";
import type { Order } from "@/lib/api/types";
import { OrderCard } from "./OrderCard";
import { OrdersEmptyState } from "./OrdersEmptyState";
import { OrdersListSkeleton } from "./OrdersListSkeleton";

type OrdersListViewProps = {
  title: string;
  eventId?: string;
};

export const OrdersListView = ({ title, eventId }: OrdersListViewProps) => {
  const t = useTranslations();
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrdersList({ eventId });
  const [openOrder, setOpenOrder] = useState<{
    id: string;
    currency: string;
  } | null>(null);

  const orders: Order[] = data?.pages.flatMap((page) => page.items) ?? [];

  const showEmpty = !isPending && !isError && orders.length === 0;

  return (
    <>
      <FeaturePageLayout>
        {showEmpty ? (
          <OrdersEmptyState />
        ) : isPending ? (
          <OrdersListSkeleton />
        ) : (
          <>
            <PageHeading
              kicker={t("orders__page__eyebrow")}
              kickerClassName="text-muted-foreground"
            >
              {title}
            </PageHeading>

            {isError && (
              <p className="type-body-small text-destructive" role="alert">
                {t("orders__page__error")}
              </p>
            )}

            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  statusLabel={t(`order__status__${order.status}`)}
                  photoCountLabel={null}
                  onClick={() =>
                    setOpenOrder({ id: order.id, currency: order.currency })
                  }
                />
              ))}
            </div>

            {hasNextPage && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  disabled={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                >
                  {isFetchingNextPage
                    ? t("orders__page__loading")
                    : t("orders__page__load_more")}
                </Button>
              </div>
            )}
          </>
        )}
      </FeaturePageLayout>

      {openOrder && (
        <OrderDetailModal
          orderId={openOrder.id}
          currency={openOrder.currency}
          onClose={() => setOpenOrder(null)}
        />
      )}
    </>
  );
};
