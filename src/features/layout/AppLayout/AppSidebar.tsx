"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { Home } from "@ovation/icons/Home";
import { MessageSquare } from "@ovation/icons/MessageSquare";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { Star } from "@ovation/icons/Star";
import { Settings } from "@ovation/icons/Settings";
import { QrCode } from "@ovation/icons/QrCode";
import { Monitor } from "@ovation/icons/Monitor";
import { UserPlus } from "@ovation/icons/UserPlus";
import { HelpCircle } from "@ovation/icons/HelpCircle";
import { Users } from "@ovation/icons/Users";
import { Sidebar } from "@/components/Sidebar";
import type { SidebarNavGroup } from "@/components/Sidebar";
import { appRoutes } from "@/lib/routes";
import type { User } from "@/lib/api/types";
import { NavUser } from "./NavUser";

type Translator = ReturnType<typeof useTranslations>;

const buildGroups = (t: Translator): SidebarNavGroup[] => [
  {
    items: [
      { label: t("sidebar__nav__home"), href: appRoutes.app.root, icon: Home },
      {
        label: t("sidebar__nav__messages"),
        href: appRoutes.app.messages,
        icon: MessageSquare,
        badge: 12,
      },
      {
        label: t("sidebar__nav__photos"),
        href: appRoutes.app.photos,
        icon: ImageIcon,
      },
      {
        label: t("sidebar__nav__keepsakes"),
        href: appRoutes.app.keepsakes,
        icon: Star,
      },
      {
        label: t("sidebar__nav__guests"),
        href: appRoutes.app.guests,
        icon: Users,
        badge: 112,
      },
      {
        label: t("sidebar__nav__settings"),
        href: appRoutes.app.settings,
        icon: Settings,
      },
    ],
  },
  {
    label: t("sidebar__quick__title"),
    items: [
      { label: t("sidebar__quick__qr"), href: appRoutes.app.qrCode, icon: QrCode },
      {
        label: t("sidebar__quick__kiosk"),
        href: appRoutes.app.kiosk,
        icon: Monitor,
      },
      {
        label: t("sidebar__quick__invite"),
        href: "/app/invite",
        icon: UserPlus,
      },
      { label: t("sidebar__quick__help"), href: "/help", icon: HelpCircle },
    ],
  },
];

type AppSideBarProps = {
  user: User;
};

export const AppSideBar = ({ user }: AppSideBarProps) => {
  const t = useTranslations();
  const groups = buildGroups(t);

  return (
    <Sidebar header={<Logo />} groups={groups} footer={<NavUser user={user} />} />
  );
};
