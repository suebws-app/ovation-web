"use client";

import { CheckIcon } from "@ovation/icons/CheckIcon";
import { HeartIcon } from "@ovation/icons/HeartIcon";
import { cn } from "@ovation/ui/utils/cn";
import type { Event } from "@/lib/api/types";
import { eventLabel } from "@/lib/utils/eventFormatters";
import { formatYear } from "@/lib/utils/formatDate";

type EventOptionProps = {
  event: Event;
  active: boolean;
  fallback: string;
  onSelect: (event: Event) => void;
};

export const EventOption = ({
  event,
  active,
  fallback,
  onSelect,
}: EventOptionProps) => {
  const year = formatYear(event.weddingDate);
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(event)}
        className={cn(
          "hover:bg-sidebar-accent rounded-8 flex w-full items-center gap-2.5 px-2.5 py-2 text-left transition-colors",
          active && "bg-sidebar-accent",
        )}
      >
        <div
          className={cn(
            "rounded-8 flex size-7 shrink-0 items-center justify-center",
            active
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          <HeartIcon className="size-3.5" />
        </div>
        <div className="grid min-w-0 flex-1">
          <span className="type-body-small truncate font-medium">
            {eventLabel(event, fallback)}
          </span>
          {year && (
            <span className="type-caption text-muted-foreground truncate">
              {year}
            </span>
          )}
        </div>
        {active && <CheckIcon className="text-primary size-4 shrink-0" />}
      </button>
    </li>
  );
};
