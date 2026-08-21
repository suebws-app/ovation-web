import { clientFetch, clientFetchPaginated, type Paginated } from "./client";
import { guestDeviceHeaders } from "@/features/guest/album/guestDevice";
import type {
  AlbumComment,
  AlbumLikeResult,
  CreateMessageResult,
  DemoSession,
  GalleryItem,
  PublicEvent,
  RsvpResult,
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
  inviteToken?: string;
  _honeypot?: string;
  _t?: number;
};

export type GalleryQuery = {
  type?: "photo" | "video" | "all";
  sort?: "newest" | "oldest";
  cursor?: string;
  limit?: number;
  mine?: boolean;
  liked?: boolean;
};

export const publicClient = {
  createDemoSession: () =>
    clientFetch<DemoSession>("/public/demo/sessions", {
      method: "POST",
      skipCsrf: true,
    }),

  getDemoSession: (slug: string) =>
    clientFetch<DemoSession>(`/public/demo/sessions/${slug}`, {
      skipCsrf: true,
    }),

  getEvent: (slug: string) =>
    clientFetch<PublicEvent>(`/public/events/${slug}`, { skipCsrf: true }),

  uploadUrls: (slug: string, request: UploadUrlRequest) =>
    clientFetch<UploadUrlsResult>(`/public/events/${slug}/upload-url`, {
      method: "POST",
      body: request,
      headers: guestDeviceHeaders(),
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
    code: string | undefined,
    query: GalleryQuery = {},
  ): Promise<Paginated<GalleryItem>> => {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      code,
    };
    if (query.type) queryParams.type = query.type;
    if (query.sort) queryParams.sort = query.sort;
    if (query.cursor) queryParams.cursor = query.cursor;
    if (query.limit !== undefined) queryParams.limit = query.limit;
    if (query.mine) queryParams.mine = "true";
    if (query.liked) queryParams.liked = "true";
    return clientFetchPaginated<GalleryItem>(`/public/events/${slug}/gallery`, {
      query: queryParams,
      headers: guestDeviceHeaders(),
      skipCsrf: true,
    });
  },

  getGalleryPinned: (slug: string, code?: string) =>
    clientFetch<GalleryItem[]>(`/public/events/${slug}/gallery-pinned`, {
      query: { code },
      headers: guestDeviceHeaders(),
      skipCsrf: true,
    }),

  likeGalleryItem: (slug: string, mediaId: string) =>
    clientFetch<AlbumLikeResult>(
      `/public/events/${slug}/gallery/${mediaId}/like`,
      { method: "POST", headers: guestDeviceHeaders(), skipCsrf: true },
    ),

  unlikeGalleryItem: (slug: string, mediaId: string) =>
    clientFetch<AlbumLikeResult>(
      `/public/events/${slug}/gallery/${mediaId}/like`,
      { method: "DELETE", headers: guestDeviceHeaders(), skipCsrf: true },
    ),

  getGalleryComments: (slug: string, mediaId: string, cursor?: string) =>
    clientFetchPaginated<AlbumComment>(
      `/public/events/${slug}/gallery/${mediaId}/comments`,
      { query: { cursor }, skipCsrf: true },
    ),

  createGalleryComment: (
    slug: string,
    mediaId: string,
    input: { guestName: string; body: string },
  ) =>
    clientFetch<AlbumComment>(
      `/public/events/${slug}/gallery/${mediaId}/comments`,
      {
        method: "POST",
        body: input,
        headers: guestDeviceHeaders(),
        skipCsrf: true,
      },
    ),

  getGalleryCount: (
    slug: string,
    code?: string,
    scope: { mine?: boolean; liked?: boolean } = {},
  ) =>
    clientFetch<{ count: number }>(`/public/events/${slug}/gallery-count`, {
      query: {
        code,
        mine: scope.mine ? "true" : undefined,
        liked: scope.liked ? "true" : undefined,
      },
      headers: guestDeviceHeaders(),
      skipCsrf: true,
    }),

  deleteOwnGalleryItem: (slug: string, mediaId: string) =>
    clientFetch<{ deleted: true }>(
      `/public/events/${slug}/gallery/${mediaId}`,
      {
        method: "DELETE",
        headers: guestDeviceHeaders(),
        skipCsrf: true,
      },
    ),

  galleryDownloadUrl: (slug: string, code: string, mediaId: string) =>
    clientFetch<{ url: string }>(
      `/public/events/${slug}/gallery/${mediaId}/download`,
      { query: { code }, skipCsrf: true },
    ),

  recordInvitationOpen: (
    slug: string,
    channel: string | null,
    token?: string | null,
  ) =>
    clientFetch<void>(`/public/events/${slug}/invitations/open`, {
      method: "POST",
      body: { channel, token: token ?? undefined },
      skipCsrf: true,
    }),

  rsvp: (
    slug: string,
    input: {
      token: string;
      status: "accepted" | "declined";
      seats?: number;
      note?: string | null;
    },
  ) =>
    clientFetch<RsvpResult>(`/public/events/${slug}/rsvp`, {
      method: "POST",
      body: input,
      skipCsrf: true,
    }),

  verifyKioskPin: (slug: string, pin: string) =>
    clientFetch<{ ok: true }>(`/public/events/${slug}/kiosk/verify-pin`, {
      method: "POST",
      body: { pin },
      skipCsrf: true,
    }),
};
