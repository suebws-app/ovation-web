import {
  clientFetch,
  clientFetchBlob,
  clientFetchPaginated,
  type Paginated,
} from "./client";
import type {
  GalleryCount,
  GalleryItem,
  MediaUploadTarget,
  PhotoSelectAll,
} from "./types";

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

export type GalleryQuery = {
  type?: "photo" | "video" | "all";
  filter?: "all" | "favorites" | "gold_book";
  sort?: "newest" | "oldest";
  search?: string;
  cursor?: string;
  limit?: number;
  includeOwnerUploads?: boolean;
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
    clientFetch<{ finalized: number }>(`${mediaPath(eventId)}/finalize`, {
      method: "POST",
      body: { items },
    }),

  galleryCount: (
    eventId: string,
    query: {
      type?: "photo" | "video" | "all";
      filter?: "all" | "favorites" | "gold_book";
      search?: string;
      includeOwnerUploads?: boolean;
    } = {},
  ): Promise<GalleryCount> => {
    const queryParams: Record<string, string | boolean | undefined> = {};
    if (query.type) queryParams.type = query.type;
    if (query.filter) queryParams.filter = query.filter;
    if (query.search) queryParams.search = query.search;
    if (query.includeOwnerUploads !== undefined)
      queryParams.includeOwnerUploads = query.includeOwnerUploads;
    return clientFetch<GalleryCount>(`${mediaPath(eventId)}/count`, {
      query: queryParams,
    });
  },

  gallery: (
    eventId: string,
    query: GalleryQuery = {},
  ): Promise<Paginated<GalleryItem>> => {
    const queryParams: Record<string, string | number | boolean | undefined> =
      {};
    if (query.type) queryParams.type = query.type;
    if (query.filter) queryParams.filter = query.filter;
    if (query.sort) queryParams.sort = query.sort;
    if (query.search) queryParams.search = query.search;
    if (query.cursor) queryParams.cursor = query.cursor;
    if (query.limit !== undefined) queryParams.limit = query.limit;
    if (query.includeOwnerUploads !== undefined)
      queryParams.includeOwnerUploads = query.includeOwnerUploads;
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

  bulkUpdate: (
    eventId: string,
    body: MediaBulkSelector & {
      action: "favorite" | "gold_book";
      value: boolean;
    },
  ): Promise<{ updated: number }> =>
    clientFetch<{ updated: number }>(`${mediaPath(eventId)}/bulk-update`, {
      method: "POST",
      body,
    }),

  bulkDelete: (eventId: string, body: MediaBulkSelector): Promise<void> =>
    clientFetch<void>(`${mediaPath(eventId)}/bulk-delete`, {
      method: "POST",
      body,
    }),

  bulkDownload: (eventId: string, body: MediaBulkSelector): Promise<Blob> =>
    clientFetchBlob(`${mediaPath(eventId)}/bulk-download`, {
      method: "POST",
      body,
    }),
};

export type MediaBulkSelector = {
  selectAll?: PhotoSelectAll | null;
  ids?: string[];
};
