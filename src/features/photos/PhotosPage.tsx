import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { eventsApi } from "@/lib/api/events";
import { messagesApi } from "@/lib/api/messages";
import { queryKeys } from "@/lib/query/keys";
import { PhotosEmptyState } from "./components/PhotosEmptyState";
import { PhotosPageClient } from "./PhotosPageClient";

export const PhotosPage = async () => {
  const events = await eventsApi.list({ limit: 1 });
  const event = events.items[0];
  if (!event) return <PhotosEmptyState />;

  const initialQuery = {
    filter: "with_photo",
    sort: "newest",
    limit: 60,
  } as const;
  const initialMessages = await messagesApi.list(event.id, initialQuery);

  const queryClient = new QueryClient();
  queryClient.setQueryData(
    queryKeys.messages.list(event.id, initialQuery),
    initialMessages,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PhotosPageClient eventId={event.id} />
    </HydrationBoundary>
  );
};
