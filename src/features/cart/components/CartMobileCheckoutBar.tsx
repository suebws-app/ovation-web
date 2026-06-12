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
};

export const CartMobileCheckoutBar = ({
  currency,
  totals,
  onCheckout,
  isCheckingOut,
  itemCount,
  ctaLabel,
}: CartMobileCheckoutBarProps) => {
  const t = useTranslations();
  const totalCents = totals?.totalCents ?? 0;
  return (
    <div className="tablet:hidden bg-card border-border fixed inset-x-0 bottom-0 z-40 border-t p-4 shadow">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="type-caption text-muted-foreground">
          {t("cart__mobile__items", { count: itemCount })}
        </span>
        <span className="type-h3 font-serif font-semibold tracking-tight">
          {formatPrice(totalCents, currency)}
        </span>
      </div>
      <Button
        type="button"
        size="lg"
        className="w-full rounded-full"
        onClick={onCheckout}
        disabled={isCheckingOut || itemCount === 0}
      >
        <LockIcon width={13} height={13} />
        {isCheckingOut
          ? t("cart__summary__checkout_pending")
          : t(ctaLabel, { total: formatPrice(totalCents, currency) })}
      </Button>
    </div>
  );
};
