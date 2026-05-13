import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eventsApi } from "@/lib/api/events";
import { appRoutes } from "@/lib/routes";

type LegacyKeepsakeCustomizerRedirectProps = {
  params: Promise<{ slug: string }>;
};

export const LegacyKeepsakeCustomizerRedirect = async ({
  params,
}: LegacyKeepsakeCustomizerRedirectProps) => {
  const { slug } = await params;
  const [cookieStore, eventsResult] = await Promise.all([
    cookies(),
    eventsApi.list({ limit: 100 }),
  ]);
  const lastEventId = cookieStore.get("ovation_last_event_id")?.value ?? null;
  const eventId =
    (lastEventId &&
      eventsResult.items.find((e) => e.id === lastEventId)?.id) ||
    eventsResult.items[0]?.id ||
    null;
  if (!eventId) redirect(appRoutes.app.events);
  redirect(appRoutes.app.eventKeepsakeCustomizer(eventId, slug));
};
