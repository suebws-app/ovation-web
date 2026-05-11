import { getTranslations } from "next-intl/server";
import { eventsApi } from "@/lib/api/events";
import { appRoutes } from "@/lib/routes";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { ProEventRow } from "./ProEventRow";

export const ProEventsListPage = async () => {
  const t = await getTranslations();
  const eventsPage = await eventsApi.list({ limit: 100 }).catch(() => null);
  const events = eventsPage?.items ?? [];

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-6 overflow-y-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="type-h2 font-semibold">{t("app__pro__events__title")}</h1>
        <Button asChild size="sm">
          <Link href={appRoutes.app.eventsNewBook}>
            {t("app__pro__events__new_event")}
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="rounded-16 border-border bg-card flex flex-col items-center justify-center gap-4 border p-12 text-center">
          <p className="text-muted-foreground type-body-small">
            {t("app__pro__events__empty")}
          </p>
          <Button asChild size="sm">
            <Link href={appRoutes.app.eventsNewBook}>
              {t("app__pro__events__new_event")}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-16 border-border bg-card border">
          {events.map((event) => (
            <ProEventRow key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};
