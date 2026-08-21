export const DEFAULT_EVENT_COVER_URL = "/images/default-event-cover.webp";

type CoverSource = {
  coverPhotoUrl?: string | null;
  couplePhotoUrl?: string | null;
} | null;

export const hostCoverUrl = (event: CoverSource): string | null =>
  event?.coverPhotoUrl ?? event?.couplePhotoUrl ?? null;

export const eventCoverUrl = (event: CoverSource): string =>
  hostCoverUrl(event) ?? DEFAULT_EVENT_COVER_URL;
