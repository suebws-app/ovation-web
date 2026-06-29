import { clientFetch, clientFetchPaginated, type Paginated } from "./client";
import type {
  CreateMessageResult,
  GalleryItem,
  PublicEvent,
  UploadUrlsResult,
} from "./types";

export type UploadMediaItem = {
  type: "photo" | "video";
  contentType: string;
};

export type UploadUrlRequest = {
  audioContentType?: string | null;
  media?: UploadMediaItem[];
  source?: SubmissionSource;
  _honeypot?: string;
  _t?: number;
};

export type SubmissionSource = "kiosk" | "qr_scan" | "direct_link";

export type CreateMessageInput = {
  guestNames: string;
  audioKey?: string | null;
  audioDurationSec?: number | null;
  audioMimeType?: string | null;
  mediaIds?: string[];
  writtenNote?: string | null;
  submissionSource: SubmissionSource;
  submissionLanguage?: string | null;
  clientCreatedAt?: string | null;
  _honeypot?: string;
  _t?: number;
};

export type GalleryQuery = {
  type?: "photo" | "video" | "all";
  sort?: "newest" | "oldest";
  cursor?: string;
  limit?: number;
};

export const publicClient = {
  getEvent: (slug: string) =>
    clientFetch<PublicEvent>(`/public/events/${slug}`, { skipCsrf: true }),

  uploadUrls: (slug: string, request: UploadUrlRequest) =>
    clientFetch<UploadUrlsResult>(`/public/events/${slug}/upload-url`, {
      method: "POST",
      body: request,
      skipCsrf: true,
    }),

  createMessage: (
    slug: string,
    idempotencyKey: string,
    input: CreateMessageInput,
  ) =>
    clientFetch<CreateMessageResult>(`/public/events/${slug}/messages`, {
      method: "POST",
      body: input,
      headers: { "Idempotency-Key": idempotencyKey },
      skipCsrf: true,
    }),

  getGallery: (
    slug: string,
    code: string,
    query: GalleryQuery = {},
  ): Promise<Paginated<GalleryItem>> => {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      code,
    };
    if (query.type) queryParams.type = query.type;
    if (query.sort) queryParams.sort = query.sort;
    if (query.cursor) queryParams.cursor = query.cursor;
    if (query.limit !== undefined) queryParams.limit = query.limit;
    return clientFetchPaginated<GalleryItem>(`/public/events/${slug}/gallery`, {
      query: queryParams,
      skipCsrf: true,
    });
  },

  galleryDownloadUrl: (slug: string, code: string, mediaId: string) =>
    clientFetch<{ url: string }>(
      `/public/events/${slug}/gallery/${mediaId}/download`,
      { query: { code }, skipCsrf: true },
    ),

  recordInvitationOpen: (slug: string, channel: string | null) =>
    clientFetch<void>(`/public/events/${slug}/invitations/open`, {
      method: "POST",
      body: { channel },
      skipCsrf: true,
    }),

  verifyKioskPin: (slug: string, pin: string) =>
    clientFetch<{ ok: true }>(`/public/events/${slug}/kiosk/verify-pin`, {
      method: "POST",
      body: { pin },
      skipCsrf: true,
    }),
};
