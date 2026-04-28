import { clientFetch } from "./client";
import type {
  CreateMessageResult,
  PublicEvent,
  UploadUrlsResult,
} from "./types";

export type UploadUrlRequest = {
  audioContentType?: string | null;
  videoContentType?: string | null;
  photoContentType?: string | null;
};

export type SubmissionSource = "kiosk" | "qr_scan" | "direct_link";

export type CreateMessageInput = {
  guestNames: string;
  audioKey?: string | null;
  audioDurationSec?: number | null;
  audioMimeType?: string | null;
  videoKey?: string | null;
  videoDurationSec?: number | null;
  videoMimeType?: string | null;
  photoKey?: string | null;
  photoWidth?: number | null;
  photoHeight?: number | null;
  writtenNote?: string | null;
  submissionSource: SubmissionSource;
  submissionLanguage?: string | null;
  clientCreatedAt?: string | null;
  _honeypot?: string;
  _t?: number;
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

  recordInvitationOpen: (slug: string, channel: string | null) =>
    clientFetch<void>(`/public/events/${slug}/invitations/open`, {
      method: "POST",
      body: { channel },
      skipCsrf: true,
    }),
};
