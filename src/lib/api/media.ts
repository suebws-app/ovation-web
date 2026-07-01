import { apiFetchPaginated } from "./server";
import type { GalleryItem } from "./types";
import type { GalleryQuery } from "./media-client";

const mediaPath = (eventId: string) => `/events/${eventId}/media`;

export const mediaApi = {
  gallery: (eventId: string, query: GalleryQuery = {}) => {
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
    return apiFetchPaginated<GalleryItem>(mediaPath(eventId), {
      query: queryParams,
    });
  },
};
