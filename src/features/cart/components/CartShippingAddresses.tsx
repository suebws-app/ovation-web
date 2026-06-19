"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Skeleton } from "@ovation/ui/components/Skeleton";
import { translateKey } from "@/lib/utils/translateKey";
import { formatVariantName } from "@/lib/utils/formatVariantName";
import { formatPrice } from "@/features/keepsakes/designTokens";
import { useCartStore, type CartItem } from "../store/useCartStore";
import { CartAddressCard } from "./CartAddressCard";
import { CartInlineShippingForm } from "./CartInlineShippingForm";

type CartShippingAddressesProps = {
  items: CartItem[];
  shippingByItemId: Record<string, number>;
  currency: string;
  loading: boolean;
  defaultCountry?: string;
  onEditItem: (id: string) => void;
  onBack: () => void;
  error: string | null;
};

export const CartShippingAddresses = ({
  items,
  shippingByItemId,
  currency,
  loading,
  defaultCountry,
  onEditItem,
  onBack,
  error,
}: CartShippingAddressesProps) => {
  const t = useTranslations();
  const sharedShipping = useCartStore((s) => s.shipping);
  const setShipping = useCartStore((s) => s.setShipping);
  const setItemShipping = useCartStore((s) => s.setItemShipping);

  const shippingItems = items.filter((i) => i.requiresShipping);
  const isMulti = shippingItems.length > 1;
  const anyUsesDefault = shippingItems.some((i) => !i.shipping);
  const showDefaultForm = isMulti && anyUsesDefault;
  const singleItem = !isMulti ? shippingItems[0] : null;

  const defaultVariantIds = shippingItems
    .filter((i) => !i.shipping)
    .map((i) => i.productVariantId)
    .filter((id): id is string => !!id);

  return (
    <div className="rounded-20 border-border bg-card flex flex-col gap-5 border p-7">
      <div className="flex flex-col gap-1.5">
        <h2 className="type-h3 font-serif font-semibold tracking-tight">
          {t("cart__addresses__title")}
        </h2>
        <p className="text-muted-foreground type-body-small">
          {isMulti
            ? t("cart__addresses__description")
            : t("cart__shipping__description")}
        </p>
      </div>

      {singleItem ? (
        <>
          <CartInlineShippingForm
            value={singleItem.shipping ?? null}
            onChange={(next) => setItemShipping(singleItem.id, next)}
            variantIds={
              singleItem.productVariantId ? [singleItem.productVariantId] : []
            }
            idPrefix={`item-${singleItem.id}`}
            defaultCountry={defaultCountry}
          />
          {loading ? (
            <Skeleton className="h-3 w-24" />
          ) : (
            typeof shippingByItemId[singleItem.id] === "number" &&
            shippingByItemId[singleItem.id] > 0 && (
              <span className="type-caption text-foreground font-medium">
                {t("cart__addresses__shipping_price", {
                  price: formatPrice(shippingByItemId[singleItem.id], currency),
                })}
              </span>
            )
          )}
        </>
      ) : (
        <>
          {showDefaultForm && (
            <CartInlineShippingForm
              value={sharedShipping}
              onChange={setShipping}
              variantIds={defaultVariantIds}
              title={t("cart__addresses__default_title")}
              subtitle={t("cart__addresses__default_subtitle")}
              idPrefix="default-ship"
              defaultCountry={defaultCountry}
            />
          )}

          <div className="flex flex-col gap-3">
            {shippingItems.map((item) => {
              const usingDefault = !item.shipping;
              return (
                <CartAddressCard
                  key={item.id}
                  title={translateKey(t, item.productNameKey)}
                  subtitle={formatVariantName(item.variantName)}
                  shipping={usingDefault ? null : (item.shipping ?? null)}
                  usingDefault={usingDefault}
                  shippingCents={shippingByItemId[item.id]}
                  currency={currency}
                  loading={loading}
                  onEdit={() => onEditItem(item.id)}
                />
              );
            })}
          </div>
        </>
      )}

      {error && (
        <p className="type-body-small text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={onBack}
        >
          {t("cart__shipping__back")}
        </Button>
      </div>
    </div>
  );
};
