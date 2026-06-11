import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { clientEnv as env } from "@/lib/utils/env.client";
import { GuestsEmptyState } from "./components/GuestsEmptyState";
import { GuestsPageClient } from "./GuestsPageClient";

const ignoreNotFound = <T,>(error: unknown, fallback: T): T => {
  if (ApiError.isApiError(error) && error.status === 404) return fallback;
  throw error;
};

export const EventGuestsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const eventResult = await eventsApi.get(id).catch(() => null);
  const event = eventResult?.event ?? null;

  if (!event) return <GuestsEmptyState />;

  const stats = await eventsApi
    .stats(event.id)
    .catch((e) => ignoreNotFound(e, null));

  const inviteUrl = `${env.APP_URL}/g/${event.slug}`;

  return (
    <GuestsPageClient eventId={event.id} stats={stats} inviteUrl={inviteUrl} />
  );
};
