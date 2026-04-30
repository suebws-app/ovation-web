import { clientFetch, clientFetchPaginated, type Paginated } from "./client";
import type {
  GalleryItem,
  ListMessagesQuery,
  MediaUploadTarget,
  MessageDetail,
  MessageSummary,
  UpdateMessageInput,
} from "./types";

const listPath = (eventId: string) => `/events/${eventId}/messages`;
const itemPath = (eventId: string, messageId: string) =>
  `/events/${eventId}/messages/${messageId}`;
const mediaPath = (eventId: string) => `/events/${eventId}/media`;

export type MediaUploadItem = {
  type: "photo" | "video";
  contentType: string;
};

export type MediaFinalizeItem = {
  mediaId: string;
  width?: number | null;
  height?: number | null;
  durationSec?: number | null;
  sizeBytes?: number | null;
};

export type OwnerCreateMessageInput = {
  mediaIds: string[];
  writtenNote?: string | null;
  clientCreatedAt?: string | null;
};

export type GalleryQuery = {
  type?: "photo" | "video" | "all";
  cursor?: string;
  limit?: number;
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

  ownerCreate: (
    eventId: string,
    input: OwnerCreateMessageInput,
  ): Promise<{ message: { id: string; status: string } }> =>
    clientFetch<{ message: { id: string; status: string } }>(
      `${listPath(eventId)}/upload`,
      { method: "POST", body: input },
    ),
};

export const mediaClient = {
  uploadUrls: (
    eventId: string,
    items: MediaUploadItem[],
  ): Promise<{ uploadTargets: MediaUploadTarget[] }> =>
    clientFetch<{ uploadTargets: MediaUploadTarget[] }>(
      `${mediaPath(eventId)}/upload-urls`,
      { method: "POST", body: { items } },
    ),

  finalize: (
    eventId: string,
    items: MediaFinalizeItem[],
  ): Promise<{ finalized: number }> =>
    clientFetch<{ finalized: number }>(
      `${mediaPath(eventId)}/finalize`,
      { method: "POST", body: { items } },
    ),

  gallery: (
    eventId: string,
    query: GalleryQuery = {},
  ): Promise<Paginated<GalleryItem>> => {
    const queryParams: Record<string, string | number | undefined> = {};
    if (query.type) queryParams.type = query.type;
    if (query.cursor) queryParams.cursor = query.cursor;
    if (query.limit !== undefined) queryParams.limit = query.limit;
    return clientFetchPaginated<GalleryItem>(mediaPath(eventId), {
      query: queryParams,
    });
  },

  remove: (eventId: string, mediaId: string): Promise<void> =>
    clientFetch<void>(`${mediaPath(eventId)}/${mediaId}`, { method: "DELETE" }),

  update: (
    eventId: string,
    mediaId: string,
    input: { isFavorite?: boolean; isGoldBookSelected?: boolean },
  ): Promise<{
    media: { id: string; isFavorite: boolean; isGoldBookSelected: boolean };
  }> =>
    clientFetch<{
      media: { id: string; isFavorite: boolean; isGoldBookSelected: boolean };
    }>(`${mediaPath(eventId)}/${mediaId}`, {
      method: "PATCH",
      body: input,
    }),
};
