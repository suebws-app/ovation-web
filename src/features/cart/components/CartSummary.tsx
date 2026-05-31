"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LockIcon } from "@ovation/icons/LockIcon";
import { ShieldIcon } from "@ovation/icons/ShieldIcon";
import { Button } from "@ovation/ui/components/Button";
import { formatPrice } from "@/features/keepsakes/designTokens";
import { useCartStore } from "../store/useCartStore";
import { CartSummaryRow } from "./CartSummaryRow";
import { PromoCodeField } from "./PromoCodeField";
import type { CartTotalsResult } from "@/lib/api/types";

type CartSummaryProps = {
  currency: string;
  totals: CartTotalsResult | null;
  onCheckout: () => void;
  isCheckingOut: boolean;
  error: string | null;
  ctaLabel: string;
};

export const CartSummary = ({
  currency,
  totals,
  onCheckout,
  isCheckingOut,
  error,
  ctaLabel,
}: CartSummaryProps) => {
  const t = useTranslations();
  const itemCount = useCartStore((s) => s.itemCount());
  const promoCode = useCartStore((s) => s.promoCode);
  const setPromoCode = useCartStore((s) => s.setPromoCode);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(promoCode);

  const subtotalCents = totals?.subtotalCents ?? 0;
  const taxCents = totals?.taxCents ?? 0;
  const shippingCents = totals?.shippingCents ?? 0;
  const totalCents = totals?.totalCents ?? 0;
  const freeShipping = totals?.freeShipping ?? false;
  const vatRate = totals?.vatRate ?? 0.1;
  const promoDiscount = totals?.promoDiscountCents ?? 0;

  const handleApplyPromo = (code: string) => {
    setAppliedPromo(code);
    setPromoCode(code);
  };

  return (
    <div className="rounded-20 border-border bg-card desktop:sticky desktop:top-5 flex flex-col gap-4 border p-7">
      <h2 className="font-serif type-h3 font-semibold tracking-tight">
        {t("cart__summary__title")}
      </h2>

      <div className="flex flex-col gap-2.5">
        <CartSummaryRow
          label={t("cart__summary__subtotal")}
          value={formatPrice(subtotalCents, currency)}
        />
        {promoDiscount > 0 && (
          <CartSummaryRow
            label={t("cart__summary__promo_applied", {
              code: appliedPromo ?? "",
            })}
            value={`−${formatPrice(promoDiscount, currency)}`}
            emphasis="positive"
          />
        )}
        <CartSummaryRow
          label={t("cart__summary__shipping")}
          value={
            freeShipping
              ? t("cart__summary__shipping_free")
              : formatPrice(shippingCents, currency)
          }
          emphasis={freeShipping ? "positive" : "default"}
          helper={freeShipping ? t("cart__summary__shipping_helper") : undefined}
        />
        <CartSummaryRow
          label={t("cart__summary__vat", {
            rate: Math.round(vatRate * 100),
          })}
          value={formatPrice(taxCents, currency)}
        />
      </div>

      <div className="bg-border h-px" />

      <div className="flex items-baseline justify-between">
        <span className="type-body-small font-bold">
          {t("cart__summary__total")}
        </span>
        <span className="font-serif type-h2 font-semibold tracking-tight">
          {formatPrice(totalCents, currency)}
        </span>
      </div>

      <PromoCodeField
        onApply={handleApplyPromo}
        disabled={isCheckingOut}
        appliedCode={appliedPromo}
      />

      {error && (
        <p className="type-caption text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        type="button"
        size="lg"
        className="rounded-full"
        onClick={onCheckout}
        disabled={isCheckingOut || itemCount === 0}
      >
        <LockIcon width={13} height={13} />
        {isCheckingOut
          ? t("cart__summary__checkout_pending")
          : t(ctaLabel, { total: formatPrice(totalCents, currency) })}
      </Button>

      <div className="text-muted-foreground type-caption flex items-center justify-center gap-3.5">
        <span className="inline-flex items-center gap-1">
          <ShieldIcon width={11} height={11} className="text-secondary" />
          {t("cart__summary__returns")}
        </span>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <LockIcon width={11} height={11} />
          {t("cart__summary__secured")}
        </span>
      </div>
    </div>
  );
};
