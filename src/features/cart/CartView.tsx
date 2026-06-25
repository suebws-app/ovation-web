"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { ApiError } from "@/lib/api/client";
import { paymentsClient } from "@/lib/api/payments-client";
import { clientEnv as env } from "@/lib/utils/env.client";
import { appRoutes } from "@/lib/routes";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import { useSession } from "@/lib/auth/client";
import { useInlinePaddleCheckout } from "@/features/checkout/paddle/useInlinePaddleCheckout";
import type {
  CartTotalsResult,
  CheckoutShippingAddress,
} from "@/lib/api/types";
import {
  useCartStore,
  effectiveItemShipping,
  type CartItem,
  type CartShipping,
} from "./store/useCartStore";
import { useBuyNowStore } from "./store/useBuyNowStore";
import { requiresState } from "./components/StateSelect";
import { CartHero } from "./components/CartHero";
import { CartItemsCard } from "./components/CartItemsCard";
import { CartSummary } from "./components/CartSummary";
import { CartEmptyState } from "./components/CartEmptyState";
import { CartShippingAddresses } from "./components/CartShippingAddresses";
import { CartItemShippingForm } from "./components/CartItemShippingForm";
import { CartInlineShippingForm } from "./components/CartInlineShippingForm";
import { CartMobileCheckoutBar } from "./components/CartMobileCheckoutBar";
import { CartPaymentPending } from "./components/CartPaymentPending";
import { CartCheckoutConfirmation } from "./components/CartCheckoutConfirmation";

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

const withCountry = (
  base: CartShipping | null,
  country: string,
): CartShipping => ({
  name: "",
  line1: "",
  line2: "",
  city: "",
  postalCode: "",
  state: undefined,
  ...(base ?? {}),
  country,
});

const CURRENCY_FALLBACK = "EUR";

type Step = "cart" | "shipping" | "payment" | "confirm";

export const CartView = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("buyNow") === "1";

  const cartItems = useCartStore((s) => s.items);
  const cartShipping = useCartStore((s) => s.shipping);
  const setCartShipping = useCartStore((s) => s.setShipping);
  const setItemShipping = useCartStore((s) => s.setItemShipping);
  const clearCart = useCartStore((s) => s.clear);
  const promoCode = useCartStore((s) => s.promoCode);

  const buyNowItem = useBuyNowStore((s) => s.item);
  const buyNowShipping = useBuyNowStore((s) => s.shipping);
  const setBuyNowShipping = useBuyNowStore((s) => s.setShipping);
  const clearBuyNow = useBuyNowStore((s) => s.clear);

  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? null;

  const buyNowActive = isBuyNow && !!buyNowItem;

  const items: CartItem[] = useMemo(
    () =>
      buyNowActive
        ? [{ ...buyNowItem!, id: "buynow", shipping: buyNowShipping }]
        : cartItems,
    [buyNowActive, buyNowItem, buyNowShipping, cartItems],
  );

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const requiresShipping = items.some((i) => i.requiresShipping);

  // Address resolved per item: own address, else the shared default.
  const addressForItem = useCallback(
    (item: CartItem): CartShipping | null =>
      buyNowActive ? buyNowShipping : effectiveItemShipping(item, cartShipping),
    [buyNowActive, buyNowShipping, cartShipping],
  );

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<Step>(buyNowActive ? "shipping" : "cart");
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [totals, setTotals] = useState<CartTotalsResult | null>(null);
  const [totalsLoading, setTotalsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const paddle = useInlinePaddleCheckout({
    userEmail,
    onCompleted: (orderId) => {
      setConfirmedOrderId(orderId ?? null);
      clearCart();
      clearBuyNow();
      setIsCheckingOut(false);
      setStep("confirm");
    },
    onClosed: () => {
      setIsCheckingOut(false);
      setStep("shipping");
    },
  });

  useEffect(() => {
    startTransition(() => setHydrated(true));
  }, []);

  // Default the shared/buy-now country from the visitor's IP location once
  // totals (which carry detectedCountry) have loaded.
  useEffect(() => {
    if (!hydrated || !requiresShipping || !totals) return;
    const country = totals.detectedCountry ?? "NL";
    if (buyNowActive) {
      if (!buyNowShipping?.country)
        setBuyNowShipping(withCountry(buyNowShipping, country));
    } else if (!cartShipping?.country) {
      setCartShipping(withCountry(cartShipping, country));
    }
  }, [
    hydrated,
    requiresShipping,
    totals,
    buyNowActive,
    buyNowShipping,
    cartShipping,
    setBuyNowShipping,
    setCartShipping,
  ]);

  const fetchTotals = useCallback(async () => {
    if (items.length === 0) {
      setTotals(null);
      return;
    }
    try {
      const result = await paymentsClient.computeCartTotals({
        eventId: items[0].eventId,
        items: items.map((i) => {
          const addr = i.requiresShipping ? addressForItem(i) : null;
          return {
            productType: i.productType,
            productVariantId: i.productVariantId ?? undefined,
            quantity: i.quantity,
            customization: i.customization,
            shippingAddress: addr?.country
              ? { country: addr.country, state: addr.state }
              : undefined,
          };
        }),
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
  }, [items, addressForItem, promoCode, t]);

  useEffect(() => {
    if (!hydrated) return;
    const handle = window.setTimeout(async () => {
      setTotalsLoading(true);
      await fetchTotals();
      setTotalsLoading(false);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [hydrated, fetchTotals]);

  const currency = totals?.currency ?? items[0]?.currency ?? CURRENCY_FALLBACK;
  const defaultCountry = totals ? (totals.detectedCountry ?? "NL") : undefined;

  const shippingByItemId = useMemo<Record<string, number>>(() => {
    const arr = totals?.shippingByItem ?? [];
    const map: Record<string, number> = {};
    items.forEach((item, index) => {
      if (typeof arr[index] === "number") map[item.id] = arr[index];
    });
    return map;
  }, [totals, items]);

  const allAddressesValid = useMemo(
    () =>
      items
        .filter((i) => i.requiresShipping)
        .every((i) => isValidShipping(addressForItem(i))),
    [items, addressForItem],
  );

  const variantIds = useMemo(
    () =>
      items
        .filter((i) => i.requiresShipping)
        .map((i) => i.productVariantId)
        .filter((id): id is string => !!id),
    [items],
  );

  const performCheckout = async () => {
    if (isCheckingOut || step === "payment" || step === "confirm") return;
    if (items.length === 0) return;
    if (requiresShipping && !allAddressesValid) {
      setError(t("cart__addresses__incomplete"));
      return;
    }
    // if (totals?.shippingUnavailable) {
    //   setError(t("cart__error__shipping_unavailable"));
    //   return;
    // }
    setError(null);
    setIsCheckingOut(true);
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : env.APP_URL;
      const result = await paymentsClient.createCheckoutSession({
        eventId: items[0].eventId,
        orderType: "keepsake",
        items: items.map((item) => {
          const addr = item.requiresShipping ? addressForItem(item) : null;
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
        shippingAddress: buyNowActive
          ? buyNowShipping
            ? toCheckoutAddress(buyNowShipping)
            : undefined
          : cartShipping
            ? toCheckoutAddress(cartShipping)
            : undefined,
        promoCode: promoCode ?? undefined,
        successUrl: `${origin}${appRoutes.checkout.orderSuccess("{CHECKOUT_SESSION_ID}")}`,
        cancelUrl: `${origin}${appRoutes.checkout.cancel("{CHECKOUT_SESSION_ID}")}`,
      });
      const opened = await paddle.open(result.providerSessionId);
      if (!opened) {
        setError(t("cart__error__payment_unavailable"));
        setStep("shipping");
        setIsCheckingOut(false);
        return;
      }
      setStep("payment");
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

  if (step !== "confirm" && buyNowActive === false && isBuyNow) {
    return <CartEmptyState />;
  }

  const renderShippingStep = () => {
    if (buyNowActive) {
      return (
        <div className="flex flex-col gap-5">
          <CartInlineShippingForm
            value={buyNowShipping}
            onChange={setBuyNowShipping}
            variantIds={variantIds}
            title={t("cart__shipping__title")}
            subtitle={t("cart__shipping__description")}
            idPrefix="buynow-ship"
            defaultCountry={defaultCountry}
          />
          <CartItemsCard
            items={items}
            shippingByItemId={shippingByItemId}
            currency={currency}
            readOnly
            loading={totalsLoading}
          />
          {error && (
            <p className="type-body-small text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
      );
    }
    if (editingItem) {
      return (
        <CartItemShippingForm
          initial={effectiveItemShipping(editingItem, cartShipping)}
          variantIds={
            editingItem.productVariantId ? [editingItem.productVariantId] : []
          }
          title={t("cart__shipping__title")}
          description={t("cart__shipping__description")}
          submitLabel={t("cart__addresses__save")}
          onSubmit={handleFormSubmit}
          onBack={() => setEditItemId(null)}
          defaultCountry={defaultCountry}
        />
      );
    }
    return (
      <CartShippingAddresses
        items={items}
        shippingByItemId={shippingByItemId}
        currency={currency}
        loading={totalsLoading}
        defaultCountry={defaultCountry}
        onEditItem={setEditItemId}
        onBack={() => setStep("cart")}
      />
    );
  };

  const showCartStep = step === "cart" && !buyNowActive;
  const showCheckoutChrome = step !== "payment" && step !== "confirm";
  const shippingUnavailable = !!totals?.shippingUnavailable;
  const checkoutDisabled = !allAddressesValid || shippingUnavailable;
  const summaryError =
    error ??
    (shippingUnavailable ? t("cart__error__shipping_unavailable") : null);

  const heroStep =
    step === "cart" ? "cart" : step === "shipping" ? "address" : step;

  return (
    <div className={cn(containerClassName, "tablet:pb-6 pb-32")}>
      <CartHero itemCount={itemCount} step={heroStep} hideCart={isBuyNow} />
      {step === "confirm" ? (
        <CartCheckoutConfirmation orderId={confirmedOrderId} />
      ) : step === "payment" ? (
        <CartPaymentPending />
      ) : items.length === 0 ? (
        <CartEmptyState />
      ) : showCartStep ? (
        <div className="desktop:grid-cols-[minmax(0,1fr)_380px] grid items-start gap-6">
          <CartItemsCard
            items={items}
            shippingByItemId={shippingByItemId}
            currency={currency}
            loading={totalsLoading}
          />
          <div className="tablet:block hidden">
            <CartSummary
              currency={currency}
              totals={totals}
              onCheckout={handleCartContinue}
              isCheckingOut={isCheckingOut}
              error={error}
              itemCount={itemCount}
              ctaLabel={
                requiresShipping
                  ? "cart__summary__continue"
                  : "cart__summary__checkout"
              }
              loading={totalsLoading}
            />
          </div>
        </div>
      ) : (
        <div className="desktop:grid-cols-[minmax(0,1fr)_380px] grid items-start gap-6">
          {renderShippingStep()}
          <div className="tablet:block hidden">
            <CartSummary
              currency={currency}
              totals={totals}
              onCheckout={() => void performCheckout()}
              isCheckingOut={isCheckingOut}
              error={summaryError}
              itemCount={itemCount}
              ctaLabel="cart__summary__checkout"
              disabled={checkoutDisabled}
              loading={totalsLoading}
            />
          </div>
        </div>
      )}
      {items.length > 0 && showCheckoutChrome && (
        <CartMobileCheckoutBar
          currency={currency}
          totals={totals}
          onCheckout={
            showCartStep ? handleCartContinue : () => void performCheckout()
          }
          isCheckingOut={isCheckingOut}
          itemCount={itemCount}
          disabled={!showCartStep && checkoutDisabled}
          error={!showCartStep ? summaryError : null}
          ctaLabel={
            showCartStep && requiresShipping
              ? "cart__summary__continue"
              : "cart__summary__checkout"
          }
          loading={totalsLoading}
        />
      )}
    </div>
  );
};
