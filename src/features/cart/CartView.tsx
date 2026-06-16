"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/api/client";
import { paymentsClient } from "@/lib/api/payments-client";
import { clientEnv as env } from "@/lib/utils/env.client";
import { appRoutes } from "@/lib/routes";
import type { CartTotalsResult } from "@/lib/api/types";
import { useShippingQuote } from "@/lib/query/shippingQueries";
import type { ShippingQuoteBody } from "@/lib/api/shipping-client";
import { useCartStore, type CartShipping } from "./store/useCartStore";
import { requiresState } from "./components/StateSelect";
import { CartHero } from "./components/CartHero";
import { CartItemsCard } from "./components/CartItemsCard";
import { CartSummary } from "./components/CartSummary";
import { CartEmptyState } from "./components/CartEmptyState";
import { CartShippingForm } from "./components/CartShippingForm";
import { CartMobileCheckoutBar } from "./components/CartMobileCheckoutBar";

const isSupportedCurrency = (
  currency: string,
): currency is ShippingQuoteBody["currency"] =>
  currency === "EUR" || currency === "USD" || currency === "GBP";

const extractPageCount = (customization: Record<string, unknown>): number => {
  const raw = customization["pageCount"];
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw);
  }
  return 0;
};

const CURRENCY_FALLBACK = "EUR";

type Step = "cart" | "shipping";

export const CartView = () => {
  const t = useTranslations();
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.itemCount());
  const shipping = useCartStore((s) => s.shipping);
  const setShipping = useCartStore((s) => s.setShipping);
  const promoCode = useCartStore((s) => s.promoCode);
  const requiresShipping = useCartStore((s) => s.requiresShipping());
  const clear = useCartStore((s) => s.clear);

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [totals, setTotals] = useState<CartTotalsResult | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startTransition(() => setHydrated(true));
  }, []);

  const fetchTotals = useCallback(async () => {
    if (items.length === 0) {
      setTotals(null);
      return;
    }
    try {
      const result = await paymentsClient.computeCartTotals({
        eventId: items[0].eventId,
        items: items.map((i) => ({
          productType: i.productType,
          productVariantId: i.productVariantId ?? undefined,
          quantity: i.quantity,
        })),
        shippingCountry: shipping?.country,
        promoCode: promoCode ?? undefined,
      });
      setTotals(result);
    } catch (err) {
      setError(
        ApiError.isApiError(err)
          ? err.message
          : t("cart__error__totals_failed"),
      );
    }
  }, [items, shipping, promoCode, t]);

  useEffect(() => {
    if (!hydrated) return;
    startTransition(() => {
      void fetchTotals();
    });
  }, [hydrated, fetchTotals]);

  const currency = totals?.currency ?? items[0]?.currency ?? CURRENCY_FALLBACK;

  const quoteBody = useMemo<ShippingQuoteBody | null>(() => {
    if (!requiresShipping || !shipping?.country) return null;
    if (!isSupportedCurrency(currency)) return null;
    if (requiresState(shipping.country) && !shipping.state) return null;
    const quotedItems = items
      .filter((item) => !!item.productVariantId)
      .map((item) => ({
        variantId: item.productVariantId as string,
        quantity: item.quantity,
        numberOfPages: extractPageCount(item.customization),
      }))
      .filter((item) => item.numberOfPages > 0);
    if (quotedItems.length === 0) return null;
    return {
      countryCode: shipping.country,
      state: shipping.state,
      currency,
      items: quotedItems,
    };
  }, [requiresShipping, shipping, currency, items]);

  const shippingQuote = useShippingQuote(quoteBody);

  const mergedTotals = useMemo<CartTotalsResult | null>(() => {
    if (!totals) return null;
    if (!shippingQuote.data) return totals;
    const shippingCents = shippingQuote.data.totalShippingCents;
    const totalCents =
      totals.subtotalCents -
      (totals.promoDiscountCents ?? 0) +
      shippingCents +
      totals.taxCents;
    return {
      ...totals,
      shippingCents,
      totalCents,
      freeShipping: shippingCents === 0,
    };
  }, [totals, shippingQuote.data]);

  const performCheckout = async (shippingAddress?: CartShipping) => {
    if (items.length === 0) return;
    setError(null);
    setIsCheckingOut(true);
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : env.APP_URL;
      const result = await paymentsClient.createCheckoutSession({
        eventId: items[0].eventId,
        orderType: "keepsake",
        items: items.map((item) => ({
          productType: item.productType,
          productVariantId: item.productVariantId ?? undefined,
          quantity: item.quantity,
          customization: item.customization,
          photoIds: item.photoSelectAll
            ? undefined
            : item.photoIds.length > 0
              ? item.photoIds
              : undefined,
          photoSelectAll: item.photoSelectAll ?? undefined,
        })),
        shippingAddress: shippingAddress
          ? {
              name: shippingAddress.name,
              line1: shippingAddress.line1,
              line2: shippingAddress.line2,
              city: shippingAddress.city,
              postalCode: shippingAddress.postalCode,
              country: shippingAddress.country,
            }
          : undefined,
        promoCode: promoCode ?? undefined,
        successUrl: `${origin}${appRoutes.checkout.orderSuccess("{CHECKOUT_SESSION_ID}")}`,
        cancelUrl: `${origin}${appRoutes.checkout.cancel("{CHECKOUT_SESSION_ID}")}`,
      });
      clear();
      window.location.assign(result.checkoutUrl);
    } catch (err) {
      setError(
        ApiError.isApiError(err)
          ? err.message
          : t("cart__error__checkout_failed"),
      );
      setIsCheckingOut(false);
    }
  };

  const handleCartContinue = () => {
    if (requiresShipping) {
      setStep("shipping");
    } else {
      performCheckout();
    }
  };

  const handleShippingSubmit = (next: CartShipping) => {
    setShipping(next);
    performCheckout(next);
  };

  if (!hydrated) return null;

  return (
    <div className="tablet:pb-6 flex flex-col gap-7 p-6 pb-32">
      <CartHero
        itemCount={itemCount}
        step={step === "shipping" ? "address" : "cart"}
      />
      {items.length === 0 ? (
        <CartEmptyState />
      ) : step === "cart" ? (
        <div className="desktop:grid-cols-[minmax(0,1fr)_380px] grid items-start gap-6">
          <CartItemsCard items={items} />
          <div className="tablet:block hidden">
            <CartSummary
              currency={currency}
              totals={mergedTotals}
              onCheckout={handleCartContinue}
              isCheckingOut={isCheckingOut}
              error={error}
              ctaLabel={
                requiresShipping
                  ? "cart__summary__continue"
                  : "cart__summary__checkout"
              }
            />
          </div>
        </div>
      ) : (
        <div className="desktop:grid-cols-[minmax(0,1fr)_380px] grid items-start gap-6">
          <CartShippingForm
            onBack={() => setStep("cart")}
            onSubmit={handleShippingSubmit}
            isSubmitting={isCheckingOut}
          />
          <div className="tablet:block hidden">
            <CartSummary
              currency={currency}
              totals={mergedTotals}
              onCheckout={() =>
                shipping ? handleShippingSubmit(shipping) : undefined
              }
              isCheckingOut={isCheckingOut}
              error={error}
              ctaLabel="cart__summary__checkout"
            />
          </div>
        </div>
      )}
      {items.length > 0 && (
        <CartMobileCheckoutBar
          currency={currency}
          totals={mergedTotals}
          onCheckout={
            step === "cart"
              ? handleCartContinue
              : () => (shipping ? handleShippingSubmit(shipping) : undefined)
          }
          isCheckingOut={isCheckingOut}
          itemCount={itemCount}
          ctaLabel={
            step === "cart" && requiresShipping
              ? "cart__summary__continue"
              : "cart__summary__checkout"
          }
        />
      )}
    </div>
  );
};
