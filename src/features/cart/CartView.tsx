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
import type {
  CartTotalsResult,
  CheckoutShippingAddress,
} from "@/lib/api/types";
import { useShippingQuotes } from "@/lib/query/shippingQueries";
import type { ShippingQuoteBody } from "@/lib/api/shipping-client";
import {
  useCartStore,
  effectiveItemShipping,
  type CartItem,
  type CartShipping,
} from "./store/useCartStore";
import { requiresState } from "./components/StateSelect";
import { CartHero } from "./components/CartHero";
import { CartItemsCard } from "./components/CartItemsCard";
import { CartSummary } from "./components/CartSummary";
import { CartEmptyState } from "./components/CartEmptyState";
import { CartShippingAddresses } from "./components/CartShippingAddresses";
import { CartItemShippingForm } from "./components/CartItemShippingForm";
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

const isValidShipping = (s: CartShipping | null): boolean =>
  !!s &&
  !!s.name.trim() &&
  !!s.line1.trim() &&
  !!s.city.trim() &&
  !!s.postalCode.trim() &&
  s.country.trim().length === 2 &&
  (!requiresState(s.country) || !!s.state);

const toCheckoutAddress = (s: CartShipping): CheckoutShippingAddress => ({
  name: s.name,
  line1: s.line1,
  line2: s.line2,
  city: s.city,
  postalCode: s.postalCode,
  country: s.country,
  state: s.state,
});

const CURRENCY_FALLBACK = "EUR";

type Step = "cart" | "shipping";

export const CartView = () => {
  const t = useTranslations();
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.itemCount());
  const shipping = useCartStore((s) => s.shipping);
  const setItemShipping = useCartStore((s) => s.setItemShipping);
  const promoCode = useCartStore((s) => s.promoCode);
  const requiresShipping = useCartStore((s) => s.requiresShipping());

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [editItemId, setEditItemId] = useState<string | null>(null);
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

  const quoteBodies = useMemo<ShippingQuoteBody[]>(() => {
    if (!requiresShipping || !isSupportedCurrency(currency)) return [];
    const byDestination = new Map<string, ShippingQuoteBody>();
    for (const item of items) {
      if (!item.requiresShipping || !item.productVariantId) continue;
      const addr = effectiveItemShipping(item, shipping);
      if (!addr?.country) continue;
      if (requiresState(addr.country) && !addr.state) continue;
      const numberOfPages = extractPageCount(item.customization);
      if (numberOfPages <= 0) continue;
      const key = `${addr.country}|${addr.state ?? ""}`;
      const quotedItem = {
        variantId: item.productVariantId,
        quantity: item.quantity,
        numberOfPages,
      };
      const existing = byDestination.get(key);
      if (existing) {
        existing.items.push(quotedItem);
      } else {
        byDestination.set(key, {
          countryCode: addr.country,
          state: addr.state,
          currency,
          items: [quotedItem],
        });
      }
    }
    return [...byDestination.values()];
  }, [requiresShipping, currency, items, shipping]);

  const shippingQuotes = useShippingQuotes(quoteBodies);

  const aggregatedShipping = useMemo<number | null>(() => {
    if (quoteBodies.length === 0) return null;
    if (!shippingQuotes.every((q) => q.data)) return null;
    return shippingQuotes.reduce(
      (sum, q) => sum + (q.data?.totalShippingCents ?? 0),
      0,
    );
  }, [quoteBodies, shippingQuotes]);

  const mergedTotals = useMemo<CartTotalsResult | null>(() => {
    if (!totals) return null;
    if (aggregatedShipping === null) return totals;
    const totalCents =
      totals.subtotalCents -
      (totals.promoDiscountCents ?? 0) +
      aggregatedShipping +
      totals.taxCents;
    return {
      ...totals,
      shippingCents: aggregatedShipping,
      totalCents,
      freeShipping: aggregatedShipping === 0,
    };
  }, [totals, aggregatedShipping]);

  const allAddressesValid = useMemo(
    () =>
      items
        .filter((i) => i.requiresShipping)
        .every((i) => isValidShipping(effectiveItemShipping(i, shipping))),
    [items, shipping],
  );

  const performCheckout = async () => {
    if (items.length === 0) return;
    if (requiresShipping && !allAddressesValid) {
      setError(t("cart__addresses__incomplete"));
      return;
    }
    setError(null);
    setIsCheckingOut(true);
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : env.APP_URL;
      const result = await paymentsClient.createCheckoutSession({
        eventId: items[0].eventId,
        orderType: "keepsake",
        items: items.map((item) => {
          const addr = item.requiresShipping
            ? effectiveItemShipping(item, shipping)
            : null;
          return {
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
            shippingAddress: addr ? toCheckoutAddress(addr) : undefined,
          };
        }),
        shippingAddress: shipping ? toCheckoutAddress(shipping) : undefined,
        promoCode: promoCode ?? undefined,
        successUrl: `${origin}${appRoutes.checkout.orderSuccess("{CHECKOUT_SESSION_ID}")}`,
        cancelUrl: `${origin}${appRoutes.checkout.cancel("{CHECKOUT_SESSION_ID}")}`,
      });
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
      setEditItemId(null);
      setStep("shipping");
    } else {
      void performCheckout();
    }
  };

  const editingItem: CartItem | null = editItemId
    ? (items.find((i) => i.id === editItemId) ?? null)
    : null;

  const handleFormSubmit = (next: CartShipping) => {
    if (editItemId) setItemShipping(editItemId, next);
    setEditItemId(null);
  };

  if (!hydrated) return null;

  const renderShippingStep = () => {
    if (editingItem) {
      return (
        <CartItemShippingForm
          initial={effectiveItemShipping(editingItem, shipping)}
          variantIds={
            editingItem.productVariantId ? [editingItem.productVariantId] : []
          }
          title={t("cart__shipping__title")}
          description={t("cart__shipping__description")}
          submitLabel={t("cart__addresses__save")}
          onSubmit={handleFormSubmit}
          onBack={() => setEditItemId(null)}
        />
      );
    }
    return (
      <CartShippingAddresses
        items={items}
        onEditItem={setEditItemId}
        onBack={() => setStep("cart")}
        error={error}
      />
    );
  };

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
          {renderShippingStep()}
          <div className="tablet:block hidden">
            <CartSummary
              currency={currency}
              totals={mergedTotals}
              onCheckout={() => void performCheckout()}
              isCheckingOut={isCheckingOut}
              error={error}
              ctaLabel="cart__summary__checkout"
              disabled={!allAddressesValid}
            />
          </div>
        </div>
      )}
      {items.length > 0 && (
        <CartMobileCheckoutBar
          currency={currency}
          totals={mergedTotals}
          onCheckout={
            step === "cart" ? handleCartContinue : () => void performCheckout()
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
