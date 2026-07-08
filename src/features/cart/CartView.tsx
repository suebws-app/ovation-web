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
import { usePeechoCheckout } from "@/features/checkout/peecho/usePeechoCheckout";
import type { CartTotalsResult } from "@/lib/api/types";
import { useCartStore, type CartItem } from "./store/useCartStore";
import { useBuyNowStore } from "./store/useBuyNowStore";
import { CartHero } from "./components/CartHero";
import { CartItemsCard } from "./components/CartItemsCard";
import { CartSummary } from "./components/CartSummary";
import { CartEmptyState } from "./components/CartEmptyState";
import { CartMobileCheckoutBar } from "./components/CartMobileCheckoutBar";
import { CartPaymentPending } from "./components/CartPaymentPending";

const CURRENCY_FALLBACK = "EUR";

type Step = "cart" | "payment";

export const CartView = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("buyNow") === "1";

  const cartItems = useCartStore((s) => s.items);
  const buyNowItem = useBuyNowStore((s) => s.item);

  const buyNowActive = isBuyNow && !!buyNowItem;

  const items: CartItem[] = useMemo(
    () => (buyNowActive ? [{ ...buyNowItem!, id: "buynow" }] : cartItems),
    [buyNowActive, buyNowItem, cartItems],
  );

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [totals, setTotals] = useState<CartTotalsResult | null>(null);
  const [totalsLoading, setTotalsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peecho = usePeechoCheckout();

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
          customization: i.customization,
        })),
      });
      setTotals(result);
    } catch (err) {
      setError(
        ApiError.isApiError(err)
          ? err.message
          : t("cart__error__totals_failed"),
      );
    }
  }, [items, t]);

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

  const performCheckout = async () => {
    if (isCheckingOut || step === "payment") return;
    if (items.length === 0) return;
    if (items.length > 1) {
      setError(t("cart__error__single_item_only"));
      return;
    }
    setError(null);
    setIsCheckingOut(true);
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : env.APP_URL;
      const item = items[0];
      const result = await paymentsClient.createCheckoutSession({
        eventId: item.eventId,
        orderType: "keepsake",
        items: [
          {
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
          },
        ],
        successUrl: `${origin}${appRoutes.checkout.orderSuccess("{CHECKOUT_SESSION_ID}")}`,
        cancelUrl: `${origin}${appRoutes.checkout.cancel("{CHECKOUT_SESSION_ID}")}`,
      });
      if (!result.checkout) {
        setError(t("cart__error__payment_unavailable"));
        setIsCheckingOut(false);
        return;
      }
      const opened = await peecho.open(result.checkout);
      console.log(opened);
      if (!opened.opened) {
        setError(t("cart__error__payment_unavailable"));
        setIsCheckingOut(false);
        return;
      }
      setStep("payment");
      setIsCheckingOut(false);
    } catch (err) {
      setError(
        ApiError.isApiError(err)
          ? err.message
          : t("cart__error__checkout_failed"),
      );
      setIsCheckingOut(false);
    }
  };

  if (!hydrated) return null;

  if (step !== "payment" && buyNowActive === false && isBuyNow) {
    return <CartEmptyState />;
  }

  const showCartStep = step === "cart";

  return (
    <div className={cn(containerClassName, "tablet:pb-6 pb-32")}>
      <CartHero itemCount={itemCount} step={step} hideCart={isBuyNow} />
      {step === "payment" ? (
        <CartPaymentPending onOpenCheckout={peecho.reopen} />
      ) : items.length === 0 ? (
        <CartEmptyState />
      ) : (
        <div className="desktop:grid-cols-[minmax(0,1fr)_380px] grid items-start gap-6">
          <div className="flex flex-col gap-4">
            <CartItemsCard
              items={items}
              shippingByItemId={{}}
              currency={currency}
              readOnly={buyNowActive}
              loading={totalsLoading}
            />
            <p className="type-caption text-muted-foreground">
              {t("cart__peecho_notice")}
            </p>
          </div>
          <div className="tablet:block hidden">
            <CartSummary
              currency={currency}
              totals={totals}
              onCheckout={() => void performCheckout()}
              isCheckingOut={isCheckingOut}
              error={error}
              itemCount={itemCount}
              ctaLabel="cart__summary__checkout"
              loading={totalsLoading}
            />
          </div>
        </div>
      )}
      {items.length > 0 && showCartStep && (
        <CartMobileCheckoutBar
          currency={currency}
          totals={totals}
          onCheckout={() => void performCheckout()}
          isCheckingOut={isCheckingOut}
          itemCount={itemCount}
          error={error}
          ctaLabel="cart__summary__checkout"
          loading={totalsLoading}
        />
      )}
    </div>
  );
};
