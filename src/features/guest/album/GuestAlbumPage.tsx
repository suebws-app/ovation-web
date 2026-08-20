import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { EventThemeScope } from "@/lib/theme/EventThemeScope";
import { eventTitleLine } from "@/lib/event-types";
import { eventCoverUrl, hostCoverUrl } from "@/lib/event-cover";
import { guestInitials } from "../welcome/guestInitials";
import { AlbumClient } from "./AlbumClient";
import { AlbumPrivate } from "./AlbumPrivate";

type GuestAlbumPageProps = {
  params: Promise<{ slug: string }>;
};

export const GuestAlbumPage = async ({ params }: GuestAlbumPageProps) => {
  const { slug } = await params;

  const event = await publicApi.getEvent(slug).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });
  if (!event) notFound();

  const title = eventTitleLine(event);
  const coverUrl = eventCoverUrl(event);
  const avatarUrl = event.hostAvatarUrl ?? hostCoverUrl(event);

  if (!event.galleryPublic) {
    return (
      <EventThemeScope event={event}>
        <AlbumPrivate
          slug={slug}
          title={title}
          initials={guestInitials(title)}
          avatarUrl={avatarUrl}
          coverUrl={coverUrl}
        />
      </EventThemeScope>
    );
  }

  return (
    <EventThemeScope event={event}>
      <AlbumClient
        slug={slug}
        title={title}
        initials={guestInitials(title)}
        avatarUrl={avatarUrl}
        coverUrl={coverUrl}
      />
    </EventThemeScope>
  );
};
