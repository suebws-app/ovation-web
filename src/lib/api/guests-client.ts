import { clientFetch, clientFetchBlob } from "./client";
import type { GuestCount, GuestSelectAll } from "./types";

const guestsPath = (eventId: string) => `/events/${eventId}/guests`;

export type GuestsBulkSelector = {
  selectAll?: GuestSelectAll | null;
  guestNames?: string[];
};

export const guestsClient = {
  count: (
    eventId: string,
    query: { filter?: string; search?: string } = {},
  ): Promise<GuestCount> => {
    const queryParams: Record<string, string | undefined> = {};
    if (query.filter) queryParams.filter = query.filter;
    if (query.search) queryParams.search = query.search;
    return clientFetch<GuestCount>(`${guestsPath(eventId)}/count`, {
      query: queryParams,
    });
  },

  bulkExportCsv: (eventId: string, body: GuestsBulkSelector): Promise<Blob> =>
    clientFetchBlob(`${guestsPath(eventId)}/bulk-export`, {
      method: "POST",
      body,
    }),
};
