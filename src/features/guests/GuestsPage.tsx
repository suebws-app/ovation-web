import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { invitationsApi } from "@/lib/api/invitations";
import { env } from "@/lib/utils/env";
import { GuestActions } from "./components/GuestActions";
import { GuestDirectory } from "./components/GuestDirectory";
import { GuestFilterChips } from "./components/GuestFilterChips";
import { GuestGroupsStrip } from "./components/GuestGroupsStrip";
import { GuestHero } from "./components/GuestHero";
import { GuestStatBar } from "./components/GuestStatBar";
import { GuestsEmptyState } from "./components/GuestsEmptyState";
import { InvitationFunnelCard } from "./components/InvitationFunnelCard";

const ignoreNotFound = <T,>(error: unknown, fallback: T): T => {
  if (ApiError.isApiError(error) && error.status === 404) return fallback;
  throw error;
};

export const GuestsPage = async () => {
  const eventsPage = await eventsApi.list({ limit: 1 });
  const event = eventsPage.items[0];
  if (!event) return <GuestsEmptyState />;

  const [stats, invitations] = await Promise.all([
    eventsApi.stats(event.id).catch((e) => ignoreNotFound(e, null)),
    invitationsApi.stats(event.id).catch((e) => ignoreNotFound(e, null)),
  ]);

  const inviteUrl = `${env.APP_URL}/g/${event.slug}`;

  return (
    <div className="flex flex-col gap-6">
      <GuestHero
        totalMessages={stats?.totalMessages ?? 0}
        inviteUrl={inviteUrl}
      />
      {stats && <GuestStatBar stats={stats} invitations={invitations} />}
      {invitations && <InvitationFunnelCard invitations={invitations} />}
      <GuestFilterChips />
      <GuestDirectory />
      <GuestGroupsStrip />
      <GuestActions />
    </div>
  );
};
