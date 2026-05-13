"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { EventSwitcher } from "./EventSwitcher";
import type { Event } from "@/lib/api/types";
import { HomeIcon } from "@ovation/icons/HomeIcon";
import { MessageSquareIcon } from "@ovation/icons/MessageSquareIcon";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { StarIcon } from "@ovation/icons/StarIcon";
import { SettingsIcon } from "@ovation/icons/SettingsIcon";
import { QrCodeIcon } from "@ovation/icons/QrCodeIcon";
import { MonitorIcon } from "@ovation/icons/MonitorIcon";
import { HelpCircleIcon } from "@ovation/icons/HelpCircleIcon";
import { UsersIcon } from "@ovation/icons/UsersIcon";
import { LinkIcon } from "@ovation/icons/LinkIcon";
import { BoxIcon } from "@ovation/icons/BoxIcon";
import { Sidebar } from "@/components/Sidebar";
import type { SidebarNavGroup } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import type { User } from "@/lib/api/types";
import { isLocale } from "@/lib/utils/isLocale";
import { NavUser } from "./NavUser";

const LAST_EVENT_COOKIE = "ovation_last_event_id";
const LAST_EVENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const readLastEventCookie = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)ovation_last_event_id=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const eventIdFromPath = (pathname: string): string | null => {
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((s) => !isLocale(s));
  if (
    segments[0] === "app" &&
    segments[1] === "events" &&
    segments[2] &&
    segments[2] !== "new"
  ) {
    return segments[2];
  }
  return null;
};

const useProEventId = (events: Event[]): string | null => {
  const pathname = usePathname();
  const fromPath = eventIdFromPath(pathname);
  const [fallback, setFallback] = useState<string | null>(null);

  useEffect(() => {
    if (fromPath) {
      document.cookie = `${LAST_EVENT_COOKIE}=${fromPath}; path=/; max-age=${LAST_EVENT_COOKIE_MAX_AGE}; samesite=lax`;
      setFallback(fromPath);
      return;
    }
    const stored = readLastEventCookie();
    if (stored && events.some((e) => e.id === stored)) {
      setFallback(stored);
    } else if (events[0]) {
      setFallback(events[0].id);
    } else {
      setFallback(null);
    }
  }, [fromPath, events]);

  return fromPath ?? fallback;
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
        label: t("sidebar__nav__orders"),
        href: appRoutes.app.orders,
        icon: BoxIcon,
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
        label: t("sidebar__quick__link"),
        href: appRoutes.app.link,
        icon: LinkIcon,
      },
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
        label: t("sidebar__quick__help"),
        href: appRoutes.app.help,
        icon: HelpCircleIcon,
      },
    ],
  },
];

const buildProGlobalGroups = (t: Translator): SidebarNavGroup[] => [
  {
    label: t("sidebar__pro__all"),
    items: [
      {
        label: t("sidebar__nav__all_orders"),
        href: appRoutes.app.orders,
        icon: BoxIcon,
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
        label: t("sidebar__nav__orders"),
        href: appRoutes.app.eventOrders(eventId),
        icon: BoxIcon,
      },
      {
        label: t("sidebar__quick__link"),
        href: appRoutes.app.eventLink(eventId),
        icon: LinkIcon,
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
  events: Event[];
};

export const AppSideBar = ({ user, events }: AppSideBarProps) => {
  const t = useTranslations();
  const eventId = useProEventId(events);
  const isPro = user.accountType === "pro";

  let groups: SidebarNavGroup[];
  if (isPro) {
    groups = eventId
      ? [...buildProEventGroups(t, eventId), ...buildProGlobalGroups(t)]
      : buildProGlobalGroups(t);
  } else {
    groups = buildCoupleGroups(t);
  }

  const header = isPro ? (
    <div className="flex items-center gap-2">
      <Logo iconOnly />
      <div className="flex-1 min-w-0">
        <EventSwitcher events={events} activeEventId={eventId} />
      </div>
    </div>
  ) : (
    <Logo />
  );

  return (
    <Sidebar
      header={header}
      groups={groups}
      footer={<NavUser user={user} />}
    />
  );
};
