"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { paymentsClient } from "@/lib/api/payments-client";
import { ApiError } from "@/lib/api/client";
import { env } from "@/lib/utils/env";
import { formatPrice } from "../designTokens";
import type {
  Event,
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type CustomizerCheckoutFormProps = {
  product: KeepsakeProductDetail;
  eventId: string | null;
  event?: Event | null;
  customization: Record<string, unknown>;
  photoIds?: string[];
  selectedVariant?: KeepsakeProductVariant | null;
  isReady: boolean;
  notReadyMessage?: string;
  children?: ReactNode;
  requiresShipping?: boolean;
  showEventBadge?: boolean;
};

const eventDisplayName = (event: Event, fallback: string): string => {
  const a = event.partnerAName?.trim();
  const b = event.partnerBName?.trim();
  if (a && b) return `${a} & ${b}`;
  return a || b || fallback;
};

export const CustomizerCheckoutForm = ({
  product,
  eventId,
  event,
  customization,
  photoIds,
  selectedVariant,
  isReady,
  notReadyMessage,
  children,
  requiresShipping = true,
  showEventBadge = true,
}: CustomizerCheckoutFormProps) => {
  const t = useTranslations();
  const add = useCartStore((s) => s.add);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!addedToCart) return;
    const timeout = setTimeout(() => setAddedToCart(false), 3000);
    return () => clearTimeout(timeout);
  }, [addedToCart]);

  const effectivePriceCents =
    selectedVariant?.priceCents ?? product.basePriceCents;
  const buttonDisabled = !eventId || !isReady || isCheckingOut;

  const handleAddToCart = () => {
    if (!eventId) return;
    add({
      eventId,
      productSku: product.sku,
      productNameKey: product.name,
      productSubtitleKey: product.subtitle,
      productKind: product.sku,
      productSlug: product.slug,
      productVariantId: selectedVariant?.id ?? null,
      variantName: selectedVariant?.name ?? null,
      unitPriceCents: effectivePriceCents,
      currency: product.currency,
      quantity: 1,
      customization,
      photoIds: photoIds ?? [],
      timelineDays: null,
      requiresShipping,
    });
    setAddedToCart(true);
  };

  const handleBuyNow = async () => {
    if (!eventId) return;
    setSubmitError(null);
    setIsCheckingOut(true);
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : env.APP_URL;
      const result = await paymentsClient.createCheckoutSession({
        eventId,
        orderType: "keepsake",
        items: [
          {
            productSku: product.sku,
            productVariantId: selectedVariant?.id ?? undefined,
            quantity: 1,
            customization,
            photoIds:
              photoIds && photoIds.length > 0 ? photoIds : undefined,
          },
        ],
        successUrl: `${origin}${appRoutes.checkout.orderSuccess("{CHECKOUT_SESSION_ID}")}`,
        cancelUrl: `${origin}${appRoutes.checkout.cancel("{CHECKOUT_SESSION_ID}")}`,
      });
      window.location.assign(result.checkoutUrl);
    } catch (err) {
      setSubmitError(
        ApiError.isApiError(err)
          ? err.message
          : t("keepsakes__order__error_default"),
      );
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="rounded-20 border-border bg-card desktop:sticky desktop:top-6 flex flex-col gap-5 border p-6 self-start">
      {event && showEventBadge && (
        <div className="rounded-12 border-border bg-muted/30 flex items-center justify-between gap-3 border px-3 py-2.5">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="type-caption text-muted-foreground">
              {t("keepsakes__order__for_event")}
            </span>
            <span className="type-body-small font-semibold truncate">
              {eventDisplayName(event, t("event_switcher__untitled"))}
            </span>
          </div>
          <Link
            href={appRoutes.app.event(event.id)}
            className="type-caption text-primary font-semibold hover:underline shrink-0"
          >
            {t("keepsakes__order__change_event")}
          </Link>
        </div>
      )}
      {children}
      {!eventId && (
        <p className="type-body-small text-muted-foreground" role="status">
          {t("keepsakes__product__create_first")}
        </p>
      )}
      {eventId && !isReady && notReadyMessage && (
        <p className="type-body-small text-muted-foreground" role="status">
          {notReadyMessage}
        </p>
      )}
      {submitError && (
        <p className="type-body-small text-destructive" role="alert">
          {submitError}
        </p>
      )}
      {addedToCart && (
        <div
          role="status"
          className="rounded-12 border-secondary/40 bg-secondary/15 text-secondary-foreground flex items-center justify-between gap-3 border px-3 py-2.5"
        >
          <span className="type-body-small font-semibold">
            {t("keepsakes__order__added_to_cart")}
          </span>
          <Link
            href={appRoutes.app.cart}
            className="type-caption text-primary font-semibold hover:underline shrink-0"
          >
            {t("keepsakes__order__view_cart")}
          </Link>
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        <Button
          type="button"
          onClick={handleBuyNow}
          disabled={buttonDisabled}
          className="rounded-full"
        >
          {isCheckingOut
            ? t("keepsakes__order__starting")
            : t("keepsakes__order__buy_now", {
                amount: formatPrice(effectivePriceCents, product.currency),
              })}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddToCart}
          disabled={buttonDisabled}
          className="rounded-full"
        >
          {t("keepsakes__order__add_to_cart_short")}
        </Button>
      </div>
    </div>
  );
};
