"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ovation/ui/components/Sidebar";
import { Input } from "@ovation/ui/components/Input";
import { ChevronsUpDownIcon } from "@ovation/icons/ChevronsUpDownIcon";
import { SearchIcon } from "@ovation/icons/SearchIcon";
import { PlusIcon } from "@ovation/icons/PlusIcon";
import { HeartIcon } from "@ovation/icons/HeartIcon";
import { SettingsIcon } from "@ovation/icons/SettingsIcon";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { isLocale } from "@/lib/utils/isLocale";
import type { Event } from "@/lib/api/types";
import { EventOption } from "./EventOption";

const eventLabel = (event: Event, fallback: string): string => {
  const a = event.partnerAName?.trim();
  const b = event.partnerBName?.trim();
  if (a && b) return `${a} & ${b}`;
  if (a || b) return a || b || fallback;
  return fallback;
};

const formatYear = (date: string | null): string | null => {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return String(d.getFullYear());
};

const stripLocale = (pathname: string): string => {
  const parts = pathname.split("/").filter(Boolean);
  const filtered = parts[0] && isLocale(parts[0]) ? parts.slice(1) : parts;
  return `/${filtered.join("/")}`;
};

const buildEventTarget = (currentPath: string, newEventId: string): string => {
  const stripped = stripLocale(currentPath);
  const segments = stripped.split("/").filter(Boolean);
  if (
    segments[0] === "app" &&
    segments[1] === "events" &&
    segments[2] &&
    segments[2] !== "new"
  ) {
    const subPath = segments.slice(3).join("/");
    return subPath
      ? `/app/events/${newEventId}/${subPath}`
      : appRoutes.app.event(newEventId);
  }
  return appRoutes.app.event(newEventId);
};

type EventSwitcherProps = {
  events: Event[];
  activeEventId: string | null;
};

export const EventSwitcher = ({
  events,
  activeEventId,
}: EventSwitcherProps) => {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const fallback = t("event_switcher__untitled");
  const activeEvent = activeEventId
    ? (events.find((e) => e.id === activeEventId) ?? null)
    : null;

  const triggerLabel = activeEvent
    ? eventLabel(activeEvent, fallback)
    : t("event_switcher__placeholder");
  const triggerSubLabel = activeEvent
    ? (formatYear(activeEvent.weddingDate) ?? t("event_switcher__active"))
    : t("event_switcher__all_events");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((event) => {
      const a = event.partnerAName?.toLowerCase() ?? "";
      const b = event.partnerBName?.toLowerCase() ?? "";
      const venue = event.venueName?.toLowerCase() ?? "";
      const city = event.venueCity?.toLowerCase() ?? "";
      return (
        a.includes(q) || b.includes(q) || venue.includes(q) || city.includes(q)
      );
    });
  }, [events, query]);

  const handleSelect = (event: Event) => {
    const target = buildEventTarget(pathname, event.id);
    setOpen(false);
    setQuery("");
    router.push(target);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              size="lg"
              aria-label={t("event_switcher__trigger_aria")}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-sidebar-border rounded-12 border"
            >
              <div className="grid flex-1 text-left leading-tight">
                <span className="type-body-small truncate font-semibold">
                  {triggerLabel}
                </span>
                <span className="type-caption text-muted-foreground truncate">
                  {triggerSubLabel}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4 shrink-0" />
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="bottom"
            sideOffset={6}
            className="w-72 gap-0 p-0"
          >
            <div className="flex items-center justify-between gap-2 p-3">
              <span className="type-caption text-muted-foreground font-semibold tracking-wide uppercase">
                {t("event_switcher__section_label")}
              </span>
              <Link
                href={appRoutes.app.events}
                onClick={() => setOpen(false)}
                className="hover:bg-muted text-foreground rounded-8 type-caption inline-flex items-center gap-1.5 px-2 py-1 font-semibold transition-colors"
              >
                <SettingsIcon className="size-3.5" />
                {t("event_switcher__manage")}
              </Link>
            </div>
            <div className="border-border border-t" />
            <div className="relative p-2">
              <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("event_switcher__search_placeholder")}
                className="h-9 pl-9"
                aria-label={t("event_switcher__search_placeholder")}
              />
            </div>
            <div className="border-border border-t" />
            <div className="max-h-56 min-h-0 overflow-y-auto overscroll-contain p-1.5">
              {filtered.length === 0 ? (
                <p className="text-muted-foreground type-caption px-3 py-6 text-center">
                  {t("event_switcher__empty")}
                </p>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {filtered.map((event) => (
                    <EventOption
                      key={event.id}
                      event={event}
                      active={event.id === activeEventId}
                      onSelect={handleSelect}
                      fallback={fallback}
                    />
                  ))}
                </ul>
              )}
            </div>
            <div className="border-border border-t" />
            <Link
              href={appRoutes.app.eventsNewBook}
              onClick={() => setOpen(false)}
              className="hover:bg-sidebar-accent type-body-small flex items-center gap-2 px-3 py-3 font-semibold"
            >
              <PlusIcon className="size-4" />
              {t("event_switcher__create")}
            </Link>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
