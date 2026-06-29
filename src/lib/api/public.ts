import { apiFetch } from "./server";
import type { PublicEvent, PublicInvitation } from "./types";

export const publicApi = {
  getEvent: (slug: string) => apiFetch<PublicEvent>(`/public/events/${slug}`),
  getInvitation: (slug: string, token: string) =>
    apiFetch<PublicInvitation>(`/public/events/${slug}/invitation`, {
      query: { t: token },
    }),
};
