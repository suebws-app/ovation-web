"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { User } from "@ovation/icons/User";
import { LinkIcon } from "@ovation/icons/LinkIcon";
import { Swatch } from "@ovation/icons/Swatch";
import { People } from "@ovation/icons/People";
import { Lock } from "@ovation/icons/Lock";
import { Bell } from "@ovation/icons/Bell";
import { CreditCard } from "@ovation/icons/CreditCard";
import { Box } from "@ovation/icons/Box";
import { Warning } from "@ovation/icons/Warning";
import { Sidebar } from "@/components/Sidebar";
import type { SidebarNavGroup } from "@/components/Sidebar";
import { appRoutes } from "@/lib/routes";

type Translator = ReturnType<typeof useTranslations>;

const buildGroups = (t: Translator): SidebarNavGroup[] => [
  {
    label: t("settings__sidebar__settings"),
    items: [
      {
        key: "profile",
        label: t("settings__sidebar__profile"),
        href: appRoutes.settings.profile,
        icon: User,
      },
      {
        key: "link",
        label: t("settings__sidebar__link"),
        href: appRoutes.settings.link,
        icon: LinkIcon,
      },
      {
        key: "branding",
        label: t("settings__sidebar__branding"),
        href: appRoutes.settings.branding,
        icon: Swatch,
      },
      {
        key: "access",
        label: t("settings__sidebar__access"),
        href: appRoutes.settings.access,
        icon: People,
      },
      {
        key: "privacy",
        label: t("settings__sidebar__privacy"),
        href: appRoutes.settings.privacy,
        icon: Lock,
      },
      {
        key: "notifications",
        label: t("settings__sidebar__notifications"),
        href: appRoutes.settings.notifications,
        icon: Bell,
      },
      {
        key: "billing",
        label: t("settings__sidebar__billing"),
        href: appRoutes.settings.billing,
        icon: CreditCard,
      },
      {
        key: "data",
        label: t("settings__sidebar__data"),
        href: appRoutes.settings.data,
        icon: Box,
      },
      {
        key: "danger",
        label: t("settings__sidebar__danger"),
        href: appRoutes.settings.danger,
        icon: Warning,
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
