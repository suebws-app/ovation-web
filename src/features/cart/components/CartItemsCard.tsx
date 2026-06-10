"use client";

import { useTranslations } from "next-intl";
import { TrashIcon } from "@ovation/icons/TrashIcon";
import { useCartStore, type CartItem } from "../store/useCartStore";
import { CartLineItem } from "./CartLineItem";

type CartItemsCardProps = {
  items: CartItem[];
};

export const CartItemsCard = ({ items }: CartItemsCardProps) => {
  const t = useTranslations();
  const clear = useCartStore((s) => s.clear);
  return (
    <div className="rounded-20 border-border bg-card border px-7">
      <div className="flex items-center justify-between py-4.5">
        <h2 className="type-h3 font-serif font-semibold tracking-tight">
          {t("cart__items__title")}{" "}
          <span className="type-body-small text-muted-foreground font-medium">
            · {t("cart__items__count", { count: items.length })}
          </span>
        </h2>
        <button
          type="button"
          onClick={clear}
          className="type-caption text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1.5 transition-colors"
        >
          <TrashIcon width={12} height={12} />
          {t("cart__items__clear")}
        </button>
      </div>
      <div className="bg-border h-px" />
      {items.map((item, index) => (
        <CartLineItem
          key={item.id}
          item={item}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
};
