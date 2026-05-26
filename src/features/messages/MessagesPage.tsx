import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { messagesApi } from "@/lib/api/messages";
import { queryKeys } from "@/lib/query/keys";
import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import { MessagesEmptyState } from "./components/MessagesEmptyState";
import { MessagesPageClient } from "./MessagesPageClient";

export const MessagesPage = async () => {
  const event = await requireFilledCoupleEvent();
  if (!event) {
    return <MessagesEmptyState />;
  }

  const initialQuery = { filter: "all", sort: "newest", limit: 50 } as const;
  const [initialMessages, stats] = await Promise.all([
    messagesApi.list(event.id, initialQuery),
    eventsApi.stats(event.id).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
  ]);

  const queryClient = new QueryClient();
  queryClient.setQueryData(
    queryKeys.messages.list(event.id, initialQuery),
    initialMessages,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MessagesPageClient eventId={event.id} stats={stats} />
    </HydrationBoundary>
  );
};
