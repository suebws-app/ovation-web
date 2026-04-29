import { clientFetch, clientFetchPaginated, type Paginated } from "./client";
import type {
  ListMessagesQuery,
  MessageDetail,
  MessageSummary,
  UpdateMessageInput,
  UploadTarget,
} from "./types";

const listPath = (eventId: string) => `/events/${eventId}/messages`;
const itemPath = (eventId: string, messageId: string) =>
  `/events/${eventId}/messages/${messageId}`;

export type OwnerUploadUrlInput = {
  photoContentType?: string | null;
  videoContentType?: string | null;
};

export type OwnerCreateMessageInput = {
  photoKey?: string | null;
  photoWidth?: number | null;
  photoHeight?: number | null;
  videoKey?: string | null;
  videoDurationSec?: number | null;
  videoMimeType?: string | null;
  clientCreatedAt?: string | null;
};

export const messagesClient = {
  list: (
    eventId: string,
    query: ListMessagesQuery = {},
  ): Promise<Paginated<MessageSummary>> =>
    clientFetchPaginated<MessageSummary>(listPath(eventId), { query }),

  get: (
    eventId: string,
    messageId: string,
  ): Promise<{ message: MessageDetail }> =>
    clientFetch<{ message: MessageDetail }>(itemPath(eventId, messageId)),

  update: (
    eventId: string,
    messageId: string,
    input: UpdateMessageInput,
  ): Promise<{
    message: {
      id: string;
      isFavorite: boolean;
      isGoldBookSelected: boolean;
    };
  }> =>
    clientFetch<{
      message: {
        id: string;
        isFavorite: boolean;
        isGoldBookSelected: boolean;
      };
    }>(itemPath(eventId, messageId), { method: "PATCH", body: input }),

  remove: (eventId: string, messageId: string): Promise<void> =>
    clientFetch<void>(itemPath(eventId, messageId), { method: "DELETE" }),

  retranscribe: (
    eventId: string,
    messageId: string,
    language?: string,
  ): Promise<{ jobId: string }> =>
    clientFetch<{ jobId: string }>(
      `${itemPath(eventId, messageId)}/retranscribe`,
      { method: "POST", body: language ? { language } : {} },
    ),

  ownerUploadUrls: (
    eventId: string,
    input: OwnerUploadUrlInput,
  ): Promise<{ uploadTargets: UploadTarget[] }> =>
    clientFetch<{ uploadTargets: UploadTarget[] }>(
      `${listPath(eventId)}/upload-url`,
      { method: "POST", body: input },
    ),

  ownerCreate: (
    eventId: string,
    input: OwnerCreateMessageInput,
  ): Promise<{ message: { id: string; status: string } }> =>
    clientFetch<{ message: { id: string; status: string } }>(
      `${listPath(eventId)}/upload`,
      { method: "POST", body: input },
    ),
};
