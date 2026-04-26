import { clientFetch } from "./client";
import type {
  CoverPhotoContentType,
  CoverUploadResult,
  CreateEventInput,
  Event,
  UpdateEventInput,
} from "./types";

export const eventsClient = {
  create: (input: CreateEventInput) =>
    clientFetch<{ event: Event }>("/events", { method: "POST", body: input }),

  update: (eventId: string, input: UpdateEventInput) =>
    clientFetch<{ event: Event }>(`/events/${eventId}`, {
      method: "PATCH",
      body: input,
    }),

  archive: (eventId: string) =>
    clientFetch<{ event: Event }>(`/events/${eventId}/archive`, {
      method: "POST",
    }),

  remove: (eventId: string) =>
    clientFetch<void>(`/events/${eventId}`, { method: "DELETE" }),

  coverUploadUrl: (eventId: string, contentType: CoverPhotoContentType) =>
    clientFetch<CoverUploadResult>(`/events/${eventId}/cover-upload-url`, {
      method: "POST",
      body: { contentType },
    }),
};
