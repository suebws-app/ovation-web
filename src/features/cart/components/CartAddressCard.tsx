"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import type { CartShipping } from "../store/useCartStore";

type CartAddressCardProps = {
  title: string;
  subtitle?: string | null;
  shipping: CartShipping | null;
  usingDefault?: boolean;
  onEdit: () => void;
};

const addressLine = (shipping: CartShipping): string =>
  [
    shipping.line1,
    shipping.line2,
    [shipping.postalCode, shipping.city].filter(Boolean).join(" "),
    shipping.state,
    shipping.country,
  ]
    .filter(Boolean)
    .join(" · ");

export const CartAddressCard = ({
  title,
  subtitle,
  shipping,
  usingDefault = false,
  onEdit,
}: CartAddressCardProps) => {
  const t = useTranslations();
  return (
    <div className="rounded-16 border-border bg-card flex items-start justify-between gap-3 border p-4">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="type-body-small font-semibold">{title}</span>
        {subtitle && (
          <span className="type-caption text-muted-foreground">{subtitle}</span>
        )}
        {usingDefault ? (
          <span className="type-caption text-muted-foreground mt-1 italic">
            {t("cart__addresses__using_default")}
          </span>
        ) : shipping ? (
          <div className="mt-1 flex flex-col gap-0.5">
            <span className="type-caption text-foreground">
              {shipping.name}
            </span>
            <span className="type-caption text-muted-foreground">
              {addressLine(shipping)}
            </span>
          </div>
        ) : (
          <span className="type-caption text-destructive mt-1">
            {t("cart__addresses__needed")}
          </span>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0 rounded-full"
        onClick={onEdit}
      >
        {usingDefault
          ? t("cart__addresses__use_different")
          : shipping
            ? t("cart__addresses__edit")
            : t("cart__addresses__add")}
      </Button>
    </div>
  );
};
