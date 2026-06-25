"use client";

import { useTranslations } from "next-intl";
import { CartIcon } from "@ovation/icons/CartIcon";
import { EmptyState } from "@/components/EmptyState";
import { appRoutes } from "@/lib/routes";

export const CartEmptyState = () => {
  const t = useTranslations();
  return (
    <EmptyState
      icon={<CartIcon width={42} height={42} strokeWidth={1.6} />}
      title={t("cart__empty__title")}
      body={t("cart__empty__body")}
      cta={{
        label: t("cart__empty__cta"),
        href: appRoutes.app.keepsakes,
      }}
    />
  );
};
