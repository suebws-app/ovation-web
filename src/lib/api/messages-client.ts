import {
  clientFetch,
  clientFetchBlob,
  clientFetchPaginated,
  type Paginated,
} from "./client";
import type {
  ListMessagesQuery,
  MessageCount,
  MessageDetail,
  MessageSelectAll,
  MessageSummary,
  UpdateMessageInput,
} from "./types";

const listPath = (eventId: string) => `/events/${eventId}/messages`;
const itemPath = (eventId: string, messageId: string) =>
  `/events/${eventId}/messages/${messageId}`;

export type MessagesBulkSelector = {
  selectAll?: MessageSelectAll | null;
  ids?: string[];
};

export const messagesClient = {
  list: (
    eventId: string,
    query: ListMessagesQuery = {},
  ): Promise<Paginated<MessageSummary>> =>
    clientFetchPaginated<MessageSummary>(listPath(eventId), { query }),

  count: (
    eventId: string,
    query: { filter?: string; search?: string } = {},
  ): Promise<MessageCount> => {
    const queryParams: Record<string, string | undefined> = {};
    if (query.filter) queryParams.filter = query.filter;
    if (query.search) queryParams.search = query.search;
    return clientFetch<MessageCount>(`${listPath(eventId)}/count`, {
      query: queryParams,
    });
  },

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

  bulkUpdate: (
    eventId: string,
    body: MessagesBulkSelector & {
      action: "favorite" | "gold_book";
      value: boolean;
    },
  ): Promise<{ updated: number }> =>
    clientFetch<{ updated: number }>(`${listPath(eventId)}/bulk-update`, {
      method: "POST",
      body,
    }),

  bulkDelete: (eventId: string, body: MessagesBulkSelector): Promise<void> =>
    clientFetch<void>(`${listPath(eventId)}/bulk-delete`, {
      method: "POST",
      body,
    }),

  bulkDownload: (eventId: string, body: MessagesBulkSelector): Promise<Blob> =>
    clientFetchBlob(`${listPath(eventId)}/bulk-download`, {
      method: "POST",
      body,
    }),

  bulkDetail: (
    eventId: string,
    ids: string[],
  ): Promise<{ messages: MessageDetail[] }> =>
    clientFetch<{ messages: MessageDetail[] }>(
      `${listPath(eventId)}/bulk-detail`,
      { method: "POST", body: { ids } },
    ),
};
