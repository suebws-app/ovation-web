import { ApiError } from "@/lib/api/client";
import { mediaApi } from "@/lib/api/media";
import { Photos } from "../components/widgets/Photos";
import { getEventStats } from "./dashboardStats";

type PhotosSectionProps = {
  eventId: string;
};

export const PhotosSection = async ({ eventId }: PhotosSectionProps) => {
  const [stats, galleryPage] = await Promise.all([
    getEventStats(eventId),
    mediaApi
      .gallery(eventId, {
        type: "photo",
        sort: "newest",
        limit: 100,
        includeOwnerUploads: true,
      })
      .catch((error) => {
        if (ApiError.isApiError(error) && error.status === 404) return null;
        throw error;
      }),
  ]);

  const galleryItems = galleryPage?.items ?? [];
  const totalPhotos = Math.max(stats?.photoCount ?? 0, galleryItems.length);
  const hasMorePhotos = Boolean(galleryPage?.nextCursor);

  return (
    <Photos
      photos={galleryItems}
      totalCount={totalPhotos}
      hasMore={hasMorePhotos}
    />
  );
};
