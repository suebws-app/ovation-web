import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { inviteesApi } from "@/lib/api/invitees";
import { queryKeys } from "@/lib/query/keys";
import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import { InviteesPageClient } from "./InviteesPageClient";
import { InviteesEmptyState } from "./components/InviteesEmptyState";

export const InviteesPage = async () => {
  const event = await requireFilledCoupleEvent();
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
