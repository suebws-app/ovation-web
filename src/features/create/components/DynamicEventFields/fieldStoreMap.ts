import type { CreateEventFormData } from "@/features/create/useCreateEventStore";
import type { EventColumn } from "@/lib/event-types";

/**
 * Maps a config field's promoted column to the (still wedding-named) create
 * store keys. The create payload is sent with legacy keys that the API aliases
 * onto the generic columns, so the store keeps its existing shape. Columns
 * without a store slot (e.g. expectedGuests) fall through to `details`.
 */
export const COLUMN_TO_STORE_KEY: Partial<
  Record<EventColumn, keyof CreateEventFormData>
> = {
  hostAName: "partner1Name",
  hostBName: "partner2Name",
  eventDate: "weddingDate",
  endDate: "endDate",
  locationName: "venueName",
  locationCity: "venueCity",
};
