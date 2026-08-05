import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { mediaApi } from "@/lib/api/media";
import { queryKeys } from "@/lib/query/keys";
import { PhotosEmptyState } from "./components/PhotosEmptyState";
import { PhotosPageClient } from "./PhotosPageClient";

export const EventPhotosPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const eventResult = await eventsApi.get(id).catch(() => null);
  const event = eventResult?.event ?? null;

  if (!event) return <PhotosEmptyState />;

  const initialGalleryQuery = {
    type: "all",
    filter: "all",
    sort: "newest",
    limit: 20,
    includeOwnerUploads: true,
  } as const;

  const [initialGallery, stats] = await Promise.all([
    mediaApi.gallery(event.id, initialGalleryQuery).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    eventsApi.stats(event.id, { includeOwnerUploads: true }).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
  ]);

  const queryClient = new QueryClient();
  if (initialGallery) {
    queryClient.setQueryData(
      queryKeys.gallery.infiniteList(event.id, initialGalleryQuery),
      {
        pages: [initialGallery],
        pageParams: [null],
      },
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PhotosPageClient eventId={event.id} stats={stats} />
    </HydrationBoundary>
  );
};
