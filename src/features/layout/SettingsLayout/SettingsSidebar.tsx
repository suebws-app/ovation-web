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
import { appRoutes } from "@/lib/routes";

type Translator = ReturnType<typeof useTranslations>;

const buildGroups = (t: Translator): SidebarNavGroup[] => [
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
      {
        key: "subscription",
        label: t("settings__sidebar__subscription"),
        href: appRoutes.settings.billing,
        icon: CreditCardIcon,
      },
      {
        key: "data",
        label: t("settings__sidebar__data"),
        href: appRoutes.settings.data,
        icon: BoxIcon,
      },
    ],
  },
];

export const SettingsSidebar = () => {
  const t = useTranslations();
  const groups = buildGroups(t);

  return <Sidebar header={<Logo />} groups={groups} />;
};
