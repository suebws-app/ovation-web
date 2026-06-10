import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { Event } from "@/lib/api/types";

type ProEventRowProps = {
  event: Event;
};

export const ProEventRow = async ({ event }: ProEventRowProps) => {
  const t = await getTranslations();
  const weddingDate = event.weddingDate
    ? new Date(event.weddingDate).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="border-border flex items-center justify-between border-b px-6 py-4 last:border-b-0">
      <div className="flex flex-col gap-0.5">
        <span className="type-body font-medium">
          {t("app__pro__events__partner_names", {
            a: event.partnerAName,
            b: event.partnerBName,
          })}
        </span>
        <span className="type-caption text-muted-foreground">
          {weddingDate}
        </span>
        {event.venueName && (
          <span className="type-caption text-muted-foreground">
            {event.venueName}
            {event.venueCity ? `, ${event.venueCity}` : ""}
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
