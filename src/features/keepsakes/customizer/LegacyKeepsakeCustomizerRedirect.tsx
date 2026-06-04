import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eventsApi } from "@/lib/api/events";
import { appRoutes } from "@/lib/routes";

const LEGACY_SLUG_REPLACEMENTS: Record<string, string> = {
  "gold-book": "hardcover-book",
};

const RETIRED_SLUGS = new Set([
  "video-montage",
  "audio-vinyl",
  "digital-album",
  "thank-you-cards",
  "canvas-print",
]);

type LegacyKeepsakeCustomizerRedirectProps = {
  params: Promise<{ slug: string }>;
};

export const LegacyKeepsakeCustomizerRedirect = async ({
  params,
}: LegacyKeepsakeCustomizerRedirectProps) => {
  const { slug } = await params;

  if (RETIRED_SLUGS.has(slug)) redirect(appRoutes.app.keepsakes);

  const resolvedSlug = LEGACY_SLUG_REPLACEMENTS[slug] ?? slug;

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
  redirect(appRoutes.app.eventKeepsakeCustomizer(eventId, resolvedSlug));
};
