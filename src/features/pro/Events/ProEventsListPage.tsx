import { getTranslations } from "next-intl/server";
import { eventsApi } from "@/lib/api/events";
import { appRoutes } from "@/lib/routes";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { PageHeading } from "@/components/PageHeading";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import { ProEventRow } from "./ProEventRow";

export const ProEventsListPage = async () => {
  const t = await getTranslations();
  const eventsPage = await eventsApi.list({ limit: 100 }).catch(() => null);
  const events = eventsPage?.items ?? [];

  return (
    <div className={containerClassName}>
      <div className="flex items-center justify-between">
        <PageHeading>{t("app__pro__events__title")}</PageHeading>
        <Button asChild size="sm">
          <Link href={appRoutes.create.root}>
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
            <Link href={appRoutes.create.root}>
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
