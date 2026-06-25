"use client";

import { useTranslations } from "next-intl";
import { LockIcon } from "@ovation/icons/LockIcon";

import { Button } from "@ovation/ui/components/Button";
import { formatPrice } from "@/features/keepsakes/designTokens";
import type { CartTotalsResult } from "@/lib/api/types";

type CartMobileCheckoutBarProps = {
  currency: string;
  totals: CartTotalsResult | null;
  onCheckout: () => void;
  isCheckingOut: boolean;
  itemCount: number;
  ctaLabel: string;
  loading?: boolean;
  disabled?: boolean;
  error?: string | null;
};

export const CartMobileCheckoutBar = ({
  currency,
  totals,
  onCheckout,
  isCheckingOut,
  itemCount,
  ctaLabel,
  loading,
  disabled = false,
  error,
}: CartMobileCheckoutBarProps) => {
  const t = useTranslations();
  const totalCents = totals?.totalCents ?? 0;
  return (
    <div className="tablet:hidden bg-card border-border fixed inset-x-0 bottom-0 z-40 border-t p-4 shadow">
      {error && (
        <p className="type-caption text-destructive mb-2" role="alert">
          {error}
        </p>
      )}
      <div className="mb-2 flex items-baseline justify-between">
        <span className="type-caption text-muted-foreground">
          {t("cart__mobile__items", { count: itemCount })}
        </span>
        <span className="type-h3 font-serif font-semibold tracking-tight tabular-nums">
          {(loading ?? totals === null) ? (
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
      </div>
      <Button
        type="button"
        className="w-full rounded-full"
        onClick={onCheckout}
        disabled={
          isCheckingOut ||
          itemCount === 0 ||
          (loading ?? totals === null) ||
          disabled
        }
      >
        <LockIcon width={13} height={13} />
        {isCheckingOut
          ? t("cart__summary__checkout_pending")
          : t(ctaLabel, {
              total:
                (loading ?? totals === null)
                  ? "…"
                  : formatPrice(totalCents, currency),
            })}
      </Button>
    </div>
  );
};
