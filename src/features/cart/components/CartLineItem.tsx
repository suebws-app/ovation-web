"use client";

import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { TruckIcon } from "@ovation/icons/TruckIcon";
import { TrashIcon } from "@ovation/icons/TrashIcon";
import { Skeleton } from "@ovation/ui/components/Skeleton";
import { formatPrice } from "@/features/keepsakes/designTokens";
import { formatVariantName } from "@/lib/utils/formatVariantName";
import { useCartStore, type CartItem } from "../store/useCartStore";
import { QuantityStepper } from "./QuantityStepper";
import { CartLineItemArt } from "./CartLineItemArt";
import { CartLineItemBookDetails } from "./CartLineItemBookDetails";

type CartLineItemProps = {
  item: CartItem;
  isLast: boolean;
  shippingCents?: number;
  currency?: string;
  readOnly?: boolean;
  loading?: boolean;
};

export const CartLineItem = ({
  item,
  isLast,
  shippingCents,
  currency,
  readOnly = false,
  loading = false,
}: CartLineItemProps) => {
  const t = useTranslations();
  const remove = useCartStore((s) => s.remove);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const lineTotalCents = item.unitPriceCents * item.quantity;
  const productName = t(item.productNameKey);
  const subtitle = item.productSubtitleKey ? t(item.productSubtitleKey) : null;
  const shipsLabel = item.timelineDays
    ? t("keepsakes__product__ships_in", { days: item.timelineDays })
    : null;
  return (
    <div
      className={cn(
        "mobile:grid-cols-[64px_1fr_auto] mobile:gap-y-5 tablet:grid-cols-[90px_1fr_auto_auto] grid grid-cols-[64px_1fr] items-start gap-x-5 gap-y-3 py-5",
        !isLast && "border-border border-b",
      )}
    >
      <CartLineItemArt kind={item.productType} />
      <div className="min-w-0">
        <div className="type-h5 font-serif font-semibold tracking-tight">
          {productName}
        </div>
        {(subtitle || item.variantName) && (
          <div className="type-caption text-muted-foreground mt-0.5">
            {[subtitle, formatVariantName(item.variantName)]
              .filter(Boolean)
              .join(" · ")}
          </div>
        )}
        <CartLineItemBookDetails
          productType={item.productType}
          customization={item.customization}
          photoCount={
            (item.customization as { pages?: unknown[] }).pages?.length ??
            item.photoIds.length
          }
        />
        <div className="mt-3.5 flex flex-wrap items-center gap-4">
          {shipsLabel && (
            <span className="type-caption text-muted-foreground inline-flex items-center gap-1.5">
              <TruckIcon width={12} height={12} />
              {shipsLabel}
            </span>
          )}
          {!readOnly && (
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="type-caption text-destructive inline-flex cursor-pointer items-center gap-1 font-semibold"
            >
              <TrashIcon width={12} height={12} />
              {t("cart__line__remove")}
            </button>
          )}
        </div>
      </div>
      <div className="tablet:flex hidden flex-col items-end gap-2">
        {!readOnly && (
          <QuantityStepper
            value={item.quantity}
            onIncrement={() => increment(item.id)}
            onDecrement={() => decrement(item.id)}
          />
        )}
      </div>
      <div className="mobile:col-span-1 col-span-2 min-w-16 text-right">
        <div className="type-h4 font-serif font-semibold tracking-tight">
          {formatPrice(lineTotalCents, item.currency)}
        </div>
        {loading && item.requiresShipping ? (
          <div className="mt-1 flex justify-end">
            <Skeleton className="h-3 w-20" />
          </div>
        ) : (
          typeof shippingCents === "number" &&
          shippingCents > 0 && (
            <div className="type-caption text-muted-foreground mt-1">
              {t("cart__line__shipping", {
                price: formatPrice(shippingCents, currency ?? item.currency),
              })}
            </div>
          )
        )}
        {!readOnly && (
          <div className="tablet:hidden mt-2 flex justify-end">
            <QuantityStepper
              value={item.quantity}
              onIncrement={() => increment(item.id)}
              onDecrement={() => decrement(item.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
