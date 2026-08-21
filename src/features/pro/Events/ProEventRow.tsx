import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { Event } from "@/lib/api/types";
import { eventTitleLine, formatDateRange } from "@/lib/event-types";

type ProEventRowProps = {
  event: Event;
};

export const ProEventRow = async ({ event }: ProEventRowProps) => {
  const t = await getTranslations();
  const eventDate =
    formatDateRange(event, (raw) =>
      new Date(raw).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    ) ?? "—";
  const locationName = event.locationName ?? event.venueName;
  const locationCity = event.locationCity ?? event.venueCity;

  return (
    <div className="border-border flex items-center justify-between border-b px-6 py-4 last:border-b-0">
      <div className="flex flex-col gap-0.5">
        <span className="type-body font-medium">{eventTitleLine(event)}</span>
        <span className="type-caption text-muted-foreground">{eventDate}</span>
        {locationName && (
          <span className="type-caption text-muted-foreground">
            {locationName}
            {locationCity ? `, ${locationCity}` : ""}
          </span>
        )}
      </div>
      <Link
        href={appRoutes.app.eventMessages(event.id)}
        className="text-primary type-body-small font-medium hover:underline"
      >
        {t("app__pro__events__view")}
      </Link>
    </div>
  );
};
