"use client";

import { useTranslations } from "next-intl";
import { UsersIcon } from "@ovation/icons/UsersIcon";
import { EmptyState } from "@/components/EmptyState";
import { appRoutes } from "@/lib/routes";

export const InviteesEmptyState = () => {
  const t = useTranslations();
  return (
    <EmptyState
      icon={<UsersIcon width={42} height={42} strokeWidth={1.6} />}
      title={t("invitees__empty__title")}
      body={t("invitees__empty__body")}
      cta={{
        label: t("invitees__empty__cta"),
        href: appRoutes.app.invitation,
      }}
    />
  );
};
