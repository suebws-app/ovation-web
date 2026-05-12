"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { HomeIcon } from "@ovation/icons/HomeIcon";
import { MessageSquareIcon } from "@ovation/icons/MessageSquareIcon";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { StarIcon } from "@ovation/icons/StarIcon";
import { SettingsIcon } from "@ovation/icons/SettingsIcon";
import { QrCodeIcon } from "@ovation/icons/QrCodeIcon";
import { MonitorIcon } from "@ovation/icons/MonitorIcon";
import { UserPlusIcon } from "@ovation/icons/UserPlusIcon";
import { HelpCircleIcon } from "@ovation/icons/HelpCircleIcon";
import { UsersIcon } from "@ovation/icons/UsersIcon";
import { GridIcon } from "@ovation/icons/GridIcon";
import { ChevronLeftIcon } from "@ovation/icons/ChevronLeftIcon";
import { Sidebar } from "@/components/Sidebar";
import type { SidebarNavGroup } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import type { User } from "@/lib/api/types";
import { isLocale } from "@/lib/utils/isLocale";
import { NavUser } from "./NavUser";

const useProEventId = (): string | null => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).filter((s) => !isLocale(s));
  if (segments[0] === "app" && segments[1] === "events" && segments[2] && segments[2] !== "new") {
    return segments[2];
  }
  return null;
};

type Translator = ReturnType<typeof useTranslations>;

const buildCoupleGroups = (t: Translator): SidebarNavGroup[] => [
  {
    items: [
      {
        label: t("sidebar__nav__home"),
        href: appRoutes.app.root,
        icon: HomeIcon,
      },
      {
        label: t("sidebar__nav__messages"),
        href: appRoutes.app.messages,
        icon: MessageSquareIcon,
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
        icon: StarIcon,
      },
      {
        label: t("sidebar__nav__guests"),
        href: appRoutes.app.guests,
        icon: UsersIcon,
        badge: 112,
      },
      {
        label: t("sidebar__nav__settings"),
        href: appRoutes.app.settings,
        icon: SettingsIcon,
      },
    ],
  },
  {
    label: t("sidebar__quick__title"),
    items: [
      {
        label: t("sidebar__quick__qr"),
        href: appRoutes.app.qrCode,
        icon: QrCodeIcon,
      },
      {
        label: t("sidebar__quick__kiosk"),
        href: appRoutes.app.kiosk,
        icon: MonitorIcon,
      },
      {
        label: t("sidebar__quick__invite"),
        href: "/app/invite",
        icon: UserPlusIcon,
      },
      { label: t("sidebar__quick__help"), href: "/help", icon: HelpCircleIcon },
    ],
  },
];

const buildProGlobalGroups = (t: Translator): SidebarNavGroup[] => [
  {
    items: [
      {
        label: t("sidebar__pro__events"),
        href: appRoutes.app.events,
        icon: GridIcon,
      },
      {
        label: t("sidebar__nav__settings"),
        href: appRoutes.settings.root,
        icon: SettingsIcon,
      },
      {
        label: t("sidebar__pro__subscription"),
        href: appRoutes.settings.billing,
        icon: StarIcon,
      },
    ],
  },
];

const buildProEventGroups = (
  t: Translator,
  eventId: string,
): SidebarNavGroup[] => [
  {
    items: [
      {
        label: t("sidebar__pro__event_back"),
        href: appRoutes.app.events,
        icon: ChevronLeftIcon,
      },
      {
        label: t("sidebar__nav__messages"),
        href: appRoutes.app.eventMessages(eventId),
        icon: MessageSquareIcon,
      },
      {
        label: t("sidebar__nav__guests"),
        href: appRoutes.app.eventGuests(eventId),
        icon: UsersIcon,
      },
      {
        label: t("sidebar__nav__photos"),
        href: appRoutes.app.eventPhotos(eventId),
        icon: ImageIcon,
      },
      {
        label: t("sidebar__nav__keepsakes"),
        href: appRoutes.app.eventKeepsakes(eventId),
        icon: StarIcon,
      },
      {
        label: t("sidebar__quick__qr"),
        href: appRoutes.app.eventQrCode(eventId),
        icon: QrCodeIcon,
      },
      {
        label: t("sidebar__quick__kiosk"),
        href: appRoutes.app.eventKiosk(eventId),
        icon: MonitorIcon,
      },
    ],
  },
];

type AppSideBarProps = {
  user: User;
};

export const AppSideBar = ({ user }: AppSideBarProps) => {
  const t = useTranslations();
  const eventId = useProEventId();

  let groups: SidebarNavGroup[];
  if (user.accountType === "pro") {
    groups = eventId
      ? buildProEventGroups(t, eventId)
      : buildProGlobalGroups(t);
  } else {
    groups = buildCoupleGroups(t);
  }

  return (
    <Sidebar
      header={<Logo />}
      groups={groups}
      footer={<NavUser user={user} />}
    />
  );
};
