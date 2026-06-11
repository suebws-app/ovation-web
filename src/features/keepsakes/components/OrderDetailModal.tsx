"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { useOrderDetail, useRefundOrder } from "@/lib/query/ordersQueries";
import { ApiError } from "@/lib/api/client";
import { safeHttpUrl } from "@/lib/utils/safe-url";
import { translateKey } from "@/lib/utils/translateKey";
import { formatPrice } from "../designTokens";
import { OrderDetailRow } from "./OrderDetailRow";
import { OrderItemLine } from "./OrderItemLine";
import { PrintApprovalBadge } from "./PrintApprovalBadge";
import { FulfillmentStatusLabel } from "./FulfillmentStatusLabel";

type OrderDetailModalProps = {
  orderId: string;
  currency: string;
  onClose: () => void;
};

export const OrderDetailModal = ({
  orderId,
  currency,
  onClose,
}: OrderDetailModalProps) => {
  const t = useTranslations();
  const { data, isPending } = useOrderDetail(orderId);
  const refund = useRefundOrder(orderId);
  const [reason, setReason] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const order = data?.order;
  const canRefund = order?.status === "paid" || order?.status === "delivered";
  const showPrintApproval =
    order?.printApprovalStatus && order.printApprovalStatus !== "not_required";

  const handleRefund = async () => {
    setSubmitError(null);
    try {
      await refund.mutateAsync({ reason: reason.trim() || undefined });
      setConfirmOpen(false);
    } catch (error) {
      setSubmitError(
        ApiError.isApiError(error)
          ? error.message
          : t("keepsakes__order__error_default"),
      );
    }
  };

  return (
    <div className="bg-foreground/45 animate-fade-in fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="rounded-20 bg-card animate-scale-fade-in flex w-full max-w-lg flex-col overflow-hidden p-7 shadow-lg">
        <div className="flex items-baseline justify-between">
          <Kicker className="text-muted-foreground">
            {t("orders__detail__title")}
          </Kicker>
          {order && (
            <span className="type-h4 text-primary font-semibold">
              {formatPrice(order.totalCents, currency)}
            </span>
          )}
        </div>

        {isPending || !order ? (
          <p className="type-body-small text-muted-foreground mt-6">…</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <OrderDetailRow
              label={t("orders__detail__status")}
              value={t(`order__status__${order.status}`)}
            />
            {showPrintApproval && order.printApprovalStatus && (
              <OrderDetailRow
                label={t("orders__detail__print_approval")}
                value={
                  <PrintApprovalBadge status={order.printApprovalStatus} />
                }
              />
            )}
            {order.fulfillmentStatus && (
              <OrderDetailRow
                label={t("orders__detail__fulfillment")}
                value={
                  <FulfillmentStatusLabel status={order.fulfillmentStatus} />
                }
              />
            )}
            <OrderDetailRow
              label={t("orders__detail__placed")}
              value={new Date(order.createdAt).toLocaleDateString()}
            />
            <div>
              <p className="type-caption text-muted-foreground mb-1.5">
                {t("orders__detail__items")}
              </p>
              <div className="flex flex-col gap-1.5">
                <OrderItemLine
                  label={`${translateKey(t, order.productName)}${order.variantName ? ` — ${order.variantName}` : ""} × ${order.quantity}`}
                  value={formatPrice(
                    order.unitPriceCents * order.quantity,
                    currency,
                  )}
                />
                {order.mediaIds.length > 0 && (
                  <p className="type-caption text-muted-foreground">
                    {order.mediaIds.length} photo
                    {order.mediaIds.length === 1 ? "" : "s"} selected
                  </p>
                )}
              </div>
            </div>
            {order.tracking?.number && (
              <OrderDetailRow
                label={t("orders__detail__tracking")}
                value={(() => {
                  const safeTrackingUrl = safeHttpUrl(order.tracking?.url);
                  return safeTrackingUrl ? (
                    <a
                      href={safeTrackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary font-semibold hover:underline"
                    >
                      {[order.tracking?.carrier, order.tracking?.number]
                        .filter(Boolean)
                        .join(" ")}
                    </a>
                  ) : (
                    [order.tracking?.carrier, order.tracking?.number]
                      .filter(Boolean)
                      .join(" ")
                  );
                })()}
              />
            )}
            {(() => {
              const safeTrackingUrl = safeHttpUrl(order.tracking?.url);
              return safeTrackingUrl ? (
                <Button
                  asChild
                  variant="outline"
                  className="self-start rounded-full"
                >
                  <a href={safeTrackingUrl} target="_blank" rel="noreferrer">
                    {t("orders__detail__track_shipment")}
                  </a>
                </Button>
              ) : null;
            })()}
          </div>
        )}

        {confirmOpen && (
          <div className="mt-5 flex flex-col gap-2">
            <label
              htmlFor="refund-reason"
              className="type-caption text-muted-foreground"
            >
              {t("orders__detail__refund_reason_label")}
            </label>
            <textarea
              id="refund-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("orders__detail__refund_reason_placeholder")}
              rows={3}
              className="border-border bg-background type-body-small rounded-12 border p-3"
            />
            {submitError && (
              <p className="type-caption text-destructive" role="alert">
                {submitError}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2.5">
          <Button variant="outline" className="rounded-full" onClick={onClose}>
            {t("orders__detail__close")}
          </Button>
          {canRefund && !confirmOpen && (
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setConfirmOpen(true)}
            >
              {t("orders__detail__refund_cta")}
            </Button>
          )}
          {confirmOpen && (
            <Button
              className="rounded-full"
              onClick={handleRefund}
              disabled={refund.isPending}
            >
              {refund.isPending
                ? t("orders__detail__refund_pending")
                : t("orders__detail__refund_confirm")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
