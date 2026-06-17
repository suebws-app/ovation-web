"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { UserIcon } from "@ovation/icons/UserIcon";
import { BellIcon } from "@ovation/icons/BellIcon";
import { CreditCardIcon } from "@ovation/icons/CreditCardIcon";
import { BoxIcon } from "@ovation/icons/BoxIcon";
import { ChevronLeftIcon } from "@ovation/icons/ChevronLeftIcon";
import { Sidebar } from "@/components/Sidebar";
import type { SidebarNavGroup } from "@/components/Sidebar";
import type { User } from "@/lib/api/types";
import { appRoutes } from "@/lib/routes";
import type { PlanTier } from "@/lib/api/types";

type Translator = ReturnType<typeof useTranslations>;

const buildGroups = (
  t: Translator,
  planTier: PlanTier | string | null,
): SidebarNavGroup[] => [
  {
    items: [
      {
        key: "back",
        label: t("settings__sidebar__back"),
        href: appRoutes.app.root,
        icon: ChevronLeftIcon,
      },
    ],
  },
  {
    label: t("settings__sidebar__settings"),
    items: [
      {
        key: "profile",
        label: t("settings__sidebar__profile"),
        href: appRoutes.settings.profile,
        icon: UserIcon,
      },
      {
        key: "notifications",
        label: t("settings__sidebar__notifications"),
        href: appRoutes.settings.notifications,
        icon: BellIcon,
      },
      ...(planTier !== "free"
        ? [
            {
              key: "subscription",
              label: t("settings__sidebar__subscription"),
              href: appRoutes.settings.billing,
              icon: CreditCardIcon,
            },
          ]
        : []),
      {
        key: "data",
        label: t("settings__sidebar__data"),
        href: appRoutes.settings.data,
        icon: BoxIcon,
      },
    ],
  },
];

type SettingsSidebarProps = {
  user: User | null;
};

export const SettingsSidebar = ({ user }: SettingsSidebarProps) => {
  const t = useTranslations();
  const groups = buildGroups(t, user?.planTier ?? null);

  return <Sidebar header={<Logo />} groups={groups} />;
};
