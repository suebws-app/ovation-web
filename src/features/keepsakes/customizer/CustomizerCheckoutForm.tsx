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
import { useCreateKeepsakePreview } from "@/lib/query/pdfQueries";
import { PreviewPdfModal } from "./PreviewPdfModal";
import type { BindType } from "@/lib/api/keepsakes-client";
import type {
  Event,
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type PriceBreakdown = {
  baseCents: number;
  pageCount: number;
  pricePerPageCents: number;
  pagesSurchargeCents: number;
  totalCents: number;
};

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
  unitPriceCents?: number;
  priceBreakdown?: PriceBreakdown;
};

const formatPricePrecise = (priceCents: number, currency: string): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(priceCents / 100);
  } catch {
    return `${(priceCents / 100).toFixed(2)} ${currency}`;
  }
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
  unitPriceCents,
  priceBreakdown,
}: CustomizerCheckoutFormProps) => {
  const t = useTranslations();
  const add = useCartStore((s) => s.add);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [previewRenderId, setPreviewRenderId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewMutation = useCreateKeepsakePreview();

  useEffect(() => {
    if (!addedToCart) return;
    const timeout = setTimeout(() => setAddedToCart(false), 3000);
    return () => clearTimeout(timeout);
  }, [addedToCart]);

  const effectivePriceCents =
    unitPriceCents ?? selectedVariant?.priceCents ?? 0;
  const productCurrency = selectedVariant?.currency ?? "EUR";
  const buttonDisabled = !eventId || !isReady || isCheckingOut;
  const showBreakdown = Boolean(
    priceBreakdown &&
      priceBreakdown.pricePerPageCents > 0 &&
      priceBreakdown.pageCount > 0,
  );

  const handleAddToCart = () => {
    if (!eventId) return;
    add({
      eventId,
      productType: product.productType,
      productNameKey: product.name,
      productSubtitleKey: product.subtitle,
      productVariantId: selectedVariant?.id ?? null,
      variantName: selectedVariant?.name ?? null,
      unitPriceCents: effectivePriceCents,
      currency: productCurrency,
      quantity: 1,
      customization,
      photoIds: photoIds ?? [],
      timelineDays: null,
      requiresShipping,
    });
    setAddedToCart(true);
  };

  const handlePreview = async () => {
    if (!eventId) return;
    setSubmitError(null);
    try {
      const bookCustomization = customization as {
        coverText?: string;
        dedication?: string;
        binding?: string;
        variantId?: string | null;
        pages?: Array<{ mediaId: string; order: number }>;
      };
      const { renderId } = await previewMutation.mutateAsync({
        eventId,
        productType: product.productType as BindType,
        productVariantId: selectedVariant?.id,
        photoIds: photoIds ?? [],
        customization: {
          coverTitle: bookCustomization.coverText,
        },
      });
      setPreviewRenderId(renderId);
      setPreviewOpen(true);
    } catch (err) {
      setSubmitError(
        ApiError.isApiError(err)
          ? err.message
          : t("keepsakes__order__error_default"),
      );
    }
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
            productType: product.productType,
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
      {showBreakdown && priceBreakdown && (
        <div className="rounded-12 border-border bg-muted/30 flex flex-col gap-1.5 border px-3 py-2.5">
          <div className="type-body-small text-muted-foreground flex items-center justify-between gap-2">
            <span>{t("keepsakes__book_customizer__price_base")}</span>
            <span>
              {formatPricePrecise(priceBreakdown.baseCents, productCurrency)}
            </span>
          </div>
          <div className="type-body-small text-muted-foreground flex items-center justify-between gap-2">
            <span>
              {t("keepsakes__book_customizer__price_pages_line", {
                count: priceBreakdown.pageCount,
                perPage: formatPricePrecise(
                  priceBreakdown.pricePerPageCents,
                  productCurrency,
                ),
              })}
            </span>
            <span>
              {formatPricePrecise(
                priceBreakdown.pagesSurchargeCents,
                productCurrency,
              )}
            </span>
          </div>
          <div className="border-border mt-1 border-t pt-1.5 type-body-small font-semibold flex items-center justify-between gap-2">
            <span>{t("keepsakes__book_customizer__price_total")}</span>
            <span>
              {formatPricePrecise(
                priceBreakdown.totalCents,
                productCurrency,
              )}
            </span>
          </div>
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
                amount: formatPrice(effectivePriceCents, productCurrency),
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
        <Button
          type="button"
          variant="outline"
          onClick={handlePreview}
          disabled={!eventId || !photoIds || photoIds.length === 0 || previewMutation.isPending}
          className="rounded-full"
        >
          {t("keepsakes__preview_pdf__button")}
        </Button>
      </div>
      <PreviewPdfModal
        renderId={previewRenderId}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
};
