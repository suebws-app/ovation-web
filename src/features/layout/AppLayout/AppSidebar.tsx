"use client";

import { useEffect, useRef, useState, startTransition } from "react";
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
import { UserPlusIcon } from "@ovation/icons/UserPlusIcon";
import { LinkIcon } from "@ovation/icons/LinkIcon";
import { BoxIcon } from "@ovation/icons/BoxIcon";
import { GridIcon } from "@ovation/icons/GridIcon";
import { Sidebar } from "@/components/Sidebar";
import type { SidebarNavGroup } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import type { User } from "@/lib/api/types";
import { isLocale } from "@/lib/utils/isLocale";
import { getCookie, setCookie } from "@/lib/utils/cookies";
import { NavUser } from "./NavUser";
import { eventsClient } from "@/lib/api/events-client";

const LAST_EVENT_COOKIE = "ovation_last_event_id";
const LAST_EVENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const readLastEventCookie = (): string | null => getCookie(LAST_EVENT_COOKIE);

const eventIdFromPath = (pathname: string): string | null => {
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((s) => !isLocale(s));
  if (segments[0] === "events" && segments[1] && segments[1] !== "new") {
    return segments[1];
  }
  return null;
};

const useProEventId = (events: Event[]): string | null => {
  const pathname = usePathname();
  const fromPath = eventIdFromPath(pathname);
  const [fallback, setFallback] = useState<string | null>(null);

  useEffect(() => {
    if (fromPath) {
      setCookie(LAST_EVENT_COOKIE, fromPath, {
        maxAge: LAST_EVENT_COOKIE_MAX_AGE,
      });
      startTransition(() => setFallback(fromPath));
      return;
    }
    const stored = readLastEventCookie();
    startTransition(() => {
      if (stored && events.some((e) => e.id === stored)) {
        setFallback(stored);
      } else if (events[0]) {
        setFallback(events[0].id);
      } else {
        setFallback(null);
      }
    });
  }, [fromPath, events]);

  return fromPath ?? fallback;
};

type Translator = ReturnType<typeof useTranslations>;

type SidebarCounts = {
  messages: number;
  guests: number;
};

const useSidebarCounts = (eventId: string | null): SidebarCounts => {
  const pathname = usePathname();
  const [counts, setCounts] = useState<SidebarCounts>({
    messages: 0,
    guests: 0,
  });
  const clearedDuringFetchRef = useRef<{ messages: boolean; guests: boolean }>({
    messages: false,
    guests: false,
  });

  useEffect(() => {
    if (!eventId) {
      startTransition(() => setCounts({ messages: 0, guests: 0 }));
      return;
    }
    clearedDuringFetchRef.current = { messages: false, guests: false };
    const controller = new AbortController();
    Promise.all([
      eventsClient.stats(eventId, controller.signal).catch(() => null),
      eventsClient
        .invitationStats(eventId, controller.signal)
        .catch(() => null),
    ]).then(([stats, invitations]) => {
      if (controller.signal.aborted) return;
      const cleared = clearedDuringFetchRef.current;
      setCounts({
        messages: cleared.messages ? 0 : (stats?.unreadMessages ?? 0),
        guests: cleared.guests ? 0 : (invitations?.totals.sent ?? 0),
      });
    });
    return () => controller.abort();
  }, [eventId, pathname]);

  useEffect(() => {
    const handler: EventListener = (e) => {
      const detail = (e as CustomEvent<{ kind: "messages" | "guests" }>).detail;
      clearedDuringFetchRef.current[detail.kind] = true;
      setCounts((prev) => ({ ...prev, [detail.kind]: 0 }));
    };
    window.addEventListener("sidebar-clear-badge", handler);
    return () => window.removeEventListener("sidebar-clear-badge", handler);
  }, []);

  return counts;
};

const buildCoupleGroups = (
  t: Translator,
  counts: SidebarCounts,
): SidebarNavGroup[] => [
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
        badge: counts.messages > 0 ? counts.messages : undefined,
      },
      {
        label: t("sidebar__nav__photos"),
        href: appRoutes.app.gallery,
        icon: ImageIcon,
      },
      {
        label: t("sidebar__nav__keepsakes"),
        href: appRoutes.app.keepsakes,
        icon: StarIcon,
        matchPaths: ["/keepsakes"],
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
        badge: counts.guests > 0 ? counts.guests : undefined,
      },
      {
        label: t("sidebar__nav__invitees"),
        href: appRoutes.app.invitees,
        icon: UserPlusIcon,
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

const buildProGlobalGroups = (
  t: Translator,
  showAnalytics: boolean,
): SidebarNavGroup[] => [
  {
    label: t("sidebar__pro__all"),
    items: [
      ...(showAnalytics
        ? [
            {
              label: t("analytics__nav"),
              href: appRoutes.app.analytics,
              icon: GridIcon,
            },
          ]
        : []),
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
  counts: SidebarCounts,
): SidebarNavGroup[] => [
  {
    items: [
      {
        label: t("sidebar__nav__home"),
        href: appRoutes.app.eventHome(eventId),
        icon: HomeIcon,
      },
      {
        label: t("sidebar__nav__messages"),
        href: appRoutes.app.eventMessages(eventId),
        icon: MessageSquareIcon,
        badge: counts.messages > 0 ? counts.messages : undefined,
      },
      {
        label: t("sidebar__nav__guests"),
        href: appRoutes.app.eventGuests(eventId),
        icon: UsersIcon,
        badge: counts.guests > 0 ? counts.guests : undefined,
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
  const isStudioPro = user.planTier === "pro_studio";
  const coupleEventId = !isPro ? (events[0]?.id ?? null) : null;
  const counts = useSidebarCounts(isPro ? eventId : coupleEventId);

  let groups: SidebarNavGroup[];
  if (isPro) {
    groups = eventId
      ? [
          ...buildProEventGroups(t, eventId, counts),
          ...buildProGlobalGroups(t, isStudioPro),
        ]
      : buildProGlobalGroups(t, isStudioPro);
  } else {
    groups = buildCoupleGroups(t, counts);
  }

  const header = isPro ? (
    <div className="flex items-center gap-2">
      <Logo iconOnly />
      <div className="min-w-0 flex-1">
        <EventSwitcher events={events} activeEventId={eventId} />
      </div>
    </div>
  ) : (
    <Logo />
  );

  return (
    <Sidebar header={header} groups={groups} footer={<NavUser user={user} />} />
  );
};
