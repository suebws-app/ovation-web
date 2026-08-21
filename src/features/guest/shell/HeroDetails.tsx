import { getLocale } from "next-intl/server";
import type { PublicEvent } from "@/lib/api/types";
import {
  eventDateOf,
  eventHostNames,
  getEventTypeConfig,
  hasEndDateField,
} from "@/lib/event-types";
import { getEventCopy } from "@/lib/event-types/getEventCopy";

type HeroDetailsProps = {
  event: PublicEvent;
};

const formatEventDate = (raw: string | null, locale: string): string => {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d
    .toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/[\s/-]/g, " · ");
};

export const HeroDetails = async ({ event }: HeroDetailsProps) => {
  const copy = await getEventCopy(event);
  const locale = await getLocale();
  const start = eventDateOf(event);
  // Multi-day types (corporate) show both dates; others ignore a stray end date.
  const supportsRange = hasEndDateField(getEventTypeConfig(event.eventType));
  const end =
    supportsRange && event.endDate && event.endDate !== start
      ? event.endDate
      : null;
  const dateLabel = end
    ? `${formatEventDate(start, locale)} – ${formatEventDate(end, locale)}`
    : formatEventDate(start, locale);
  const names = eventHostNames(event);

  return (
    <div className="text-center">
      <p className="type-overline text-primary mb-2.5">
        {copy("guest__landing__welcome_overline")}
      </p>
      <h1 className="type-h1 leading-none font-semibold tracking-tight">
        {names.length > 1 ? (
          <>
            {names[0]} <span className="text-primary italic">&amp;</span>{" "}
            {names[1]}
          </>
        ) : (
          names[0]
        )}
      </h1>
      {dateLabel && (
        <p className="type-caption text-muted-foreground mt-2.5 font-mono tracking-wider">
          {dateLabel}
        </p>
      )}
    </div>
  );
};
