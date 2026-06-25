"use client";

import { useTranslations } from "next-intl";
import { BoxIcon } from "@ovation/icons/BoxIcon";
import { GiftIcon } from "@ovation/icons/GiftIcon";
import { EmptyState } from "@/components/EmptyState";
import { appRoutes } from "@/lib/routes";

export const OrdersEmptyState = () => {
  const t = useTranslations();

  return (
    <EmptyState
      icon={<BoxIcon width={42} height={42} strokeWidth={1.6} />}
      badgeIcon={<GiftIcon width={18} height={18} strokeWidth={2} />}
      title={t("orders__page__empty_title")}
      body={t("orders__page__empty_body")}
      cta={{
        label: t("orders__page__empty_cta"),
        href: appRoutes.app.keepsakes,
        icon: <GiftIcon width={16} height={16} />,
      }}
    />
  );
};
