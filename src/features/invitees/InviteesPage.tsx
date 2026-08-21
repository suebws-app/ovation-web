import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { inviteesApi } from "@/lib/api/invitees";
import { queryKeys } from "@/lib/query/keys";
import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import type { Event } from "@/lib/api/types";
import { InviteesPageClient } from "./InviteesPageClient";
import { InviteesEmptyState } from "./components/InviteesEmptyState";

export const InviteesPage = async ({
  event: eventProp,
}: { event?: Event | null } = {}) => {
  const event = eventProp ?? (await requireFilledCoupleEvent());
  if (!event) {
    return <InviteesEmptyState />;
  }

  const initial = await inviteesApi.list(event.id).catch(() => ({
    invitees: [],
  }));

  const queryClient = new QueryClient();
  queryClient.setQueryData(queryKeys.invitees.list(event.id), initial);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InviteesPageClient event={event} />
    </HydrationBoundary>
  );
};
