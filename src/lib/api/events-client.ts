import { clientFetch } from "./client";
import type {
  CoverPhotoContentType,
  CoverUploadResult,
  CreateEventInput,
  Event,
  EventStats,
  InvitationStats,
  QrCodeFormat,
  QrCodeResult,
  UpdateEventInput,
} from "./types";

export const eventsClient = {
  create: (input: CreateEventInput) =>
    clientFetch<{ event: Event }>("/events", { method: "POST", body: input }),

  checkSlug: (slug: string, signal?: AbortSignal) =>
    clientFetch<{ available: boolean }>("/events/slug-available", {
      query: { slug },
      signal,
    }),

  slugSuggestions: (
    params: { partnerAName?: string; partnerBName?: string },
    signal?: AbortSignal,
  ) =>
    clientFetch<{ suggestions: string[] }>("/events/slug-suggestions", {
      query: params,
      signal,
    }),

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

  qrCode: (eventId: string, format: QrCodeFormat = "png", size = 1024) =>
    clientFetch<QrCodeResult>(`/events/${eventId}/qr`, {
      query: { format, size },
    }),

  stats: (eventId: string, signal?: AbortSignal) =>
    clientFetch<EventStats>(`/events/${eventId}/stats`, { signal }),

  invitationStats: (eventId: string, signal?: AbortSignal) =>
    clientFetch<InvitationStats>(`/events/${eventId}/invitations/stats`, {
      signal,
    }),

  markSeen: (eventId: string, resource: "messages" | "guests") =>
    clientFetch<void>(`/events/${eventId}/mark-seen`, {
      method: "POST",
      body: { resource },
    }),
};
