"use client";

import { useTranslations } from "next-intl";
import { LockIcon } from "@ovation/icons/LockIcon";
import { Button } from "@ovation/ui/components/Button";
import { formatPrice } from "@/features/keepsakes/designTokens";
import { useCartStore } from "../store/useCartStore";
import { CartSummaryRow } from "./CartSummaryRow";
import type { CartTotalsResult } from "@/lib/api/types";

type CartSummaryProps = {
  currency: string;
  totals: CartTotalsResult | null;
  onCheckout: () => void;
  isCheckingOut: boolean;
  error: string | null;
  ctaLabel: string;
  disabled?: boolean;
  hideCheckout?: boolean;
  loading?: boolean;
  itemCount?: number;
};

export const CartSummary = ({
  currency,
  totals,
  onCheckout,
  isCheckingOut,
  error,
  ctaLabel,
  disabled = false,
  hideCheckout = false,
  loading: loadingProp,
  itemCount: itemCountProp,
}: CartSummaryProps) => {
  const t = useTranslations();
  const storeItemCount = useCartStore((s) => s.itemCount());
  const itemCount = itemCountProp ?? storeItemCount;

  const loading = loadingProp ?? totals === null;
  const subtotalCents = totals?.subtotalCents ?? 0;
  const totalCents = totals?.totalCents ?? 0;
  const priceSkeleton = (
    <span
      aria-hidden="true"
      className="bg-muted-foreground/15 animate-pulse rounded text-transparent"
    >
      {formatPrice(0, currency)}
    </span>
  );

  return (
    <div className="rounded-20 border-border bg-card desktop:sticky desktop:top-5 flex flex-col gap-4 border p-7">
      <h2 className="type-h3 font-serif font-semibold tracking-tight">
        {t("cart__summary__title")}
      </h2>

      <div className="flex flex-col gap-2.5">
        <CartSummaryRow
          label={t("cart__summary__subtotal")}
          value={loading ? priceSkeleton : formatPrice(subtotalCents, currency)}
        />
        <CartSummaryRow
          label={t("cart__summary__shipping")}
          value={t("cart__summary__shipping_at_checkout")}
        />
      </div>

      <div className="bg-border h-px" />

      <div className="flex items-baseline justify-between">
        <span className="type-body-small font-bold">
          {t("cart__summary__total")}
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className="type-h2 font-serif font-semibold tracking-tight tabular-nums">
            {loading ? (
              <span
                aria-hidden="true"
                className="bg-muted-foreground/15 animate-pulse rounded text-transparent"
              >
                {formatPrice(0, currency)}
              </span>
            ) : (
              formatPrice(totalCents, currency)
            )}
          </span>
          <span className="type-caption text-muted-foreground">
            {t("cart__summary__excl_shipping")}
          </span>
        </span>
      </div>

      {error && (
        <p className="type-caption text-destructive" role="alert">
          {error}
        </p>
      )}

      {!hideCheckout && (
        <Button
          type="button"
          className="rounded-full"
          onClick={onCheckout}
          disabled={isCheckingOut || itemCount === 0 || loading || disabled}
        >
          <LockIcon width={13} height={13} />
          {isCheckingOut
            ? t("cart__summary__checkout_pending")
            : t(ctaLabel, {
                total: loading ? "…" : formatPrice(totalCents, currency),
              })}
        </Button>
      )}
    </div>
  );
};
