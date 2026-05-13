"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { UserIcon } from "@ovation/icons/UserIcon";
import { LockIcon } from "@ovation/icons/LockIcon";
import { BellIcon } from "@ovation/icons/BellIcon";
import { BoxIcon } from "@ovation/icons/BoxIcon";
import { WarningIcon } from "@ovation/icons/WarningIcon";
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
        key: "privacy",
        label: t("settings__sidebar__privacy"),
        href: appRoutes.settings.privacy,
        icon: LockIcon,
      },
      {
        key: "notifications",
        label: t("settings__sidebar__notifications"),
        href: appRoutes.settings.notifications,
        icon: BellIcon,
      },
      {
        key: "data",
        label: t("settings__sidebar__data"),
        href: appRoutes.settings.data,
        icon: BoxIcon,
      },
      {
        key: "danger",
        label: t("settings__sidebar__danger"),
        href: appRoutes.settings.danger,
        icon: WarningIcon,
        variant: "warn",
      },
    ],
  },
];

export const SettingsSidebar = () => {
  const t = useTranslations();
  const groups = buildGroups(t);

  return <Sidebar header={<Logo />} groups={groups} />;
};
