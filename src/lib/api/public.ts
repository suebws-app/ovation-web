import { publicApiFetch } from "./server";
import type { PublicEvent, PublicInvitation } from "./types";

export const publicApi = {
  getEvent: (slug: string) =>
    publicApiFetch<PublicEvent>(`/public/events/${slug}`),
  getInvitation: (slug: string, token: string) =>
    publicApiFetch<PublicInvitation>(`/public/events/${slug}/invitation`, {
      query: { t: token },
    }),
};
