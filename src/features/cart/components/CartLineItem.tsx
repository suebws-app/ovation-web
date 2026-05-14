"use client";

import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { TruckIcon } from "@ovation/icons/TruckIcon";
import { TrashIcon } from "@ovation/icons/TrashIcon";
import { formatPrice } from "@/features/keepsakes/designTokens";
import { useCartStore, type CartItem } from "../store/useCartStore";
import { QuantityStepper } from "./QuantityStepper";
import { CartLineItemArt } from "./CartLineItemArt";

type CartLineItemProps = {
  item: CartItem;
  isLast: boolean;
};

export const CartLineItem = ({ item, isLast }: CartLineItemProps) => {
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
        "tablet:grid-cols-[90px_1fr_auto_auto] grid grid-cols-[64px_1fr_auto] items-start gap-5 py-5",
        !isLast && "border-border border-b",
      )}
    >
      <CartLineItemArt kind={item.productKind} />
      <div className="min-w-0">
        <div className="font-serif type-h5 font-semibold tracking-tight">
          {productName}
        </div>
        {(subtitle || item.variantName) && (
          <div className="type-caption text-muted-foreground mt-0.5">
            {[subtitle, item.variantName].filter(Boolean).join(" · ")}
          </div>
        )}
        <div className="mt-3.5 flex flex-wrap items-center gap-4">
          {shipsLabel && (
            <span className="type-caption text-muted-foreground inline-flex items-center gap-1.5">
              <TruckIcon width={12} height={12} />
              {shipsLabel}
            </span>
          )}
          <button
            type="button"
            onClick={() => remove(item.id)}
            className="type-caption text-destructive inline-flex cursor-pointer items-center gap-1 font-semibold"
          >
            <TrashIcon width={12} height={12} />
            {t("cart__line__remove")}
          </button>
        </div>
      </div>
      <div className="tablet:flex hidden flex-col items-end gap-2">
        <QuantityStepper
          value={item.quantity}
          onIncrement={() => increment(item.id)}
          onDecrement={() => decrement(item.id)}
        />
      </div>
      <div className="min-w-16 text-right">
        <div className="font-serif type-h4 font-semibold tracking-tight">
          {formatPrice(lineTotalCents, item.currency)}
        </div>
        <div className="tablet:hidden mt-2 flex justify-end">
          <QuantityStepper
            value={item.quantity}
            onIncrement={() => increment(item.id)}
            onDecrement={() => decrement(item.id)}
          />
        </div>
      </div>
    </div>
  );
};

