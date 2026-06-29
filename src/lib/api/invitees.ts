import { apiFetch } from "./server";
import type { Invitee } from "./types";

export const inviteesApi = {
  list: (eventId: string) =>
    apiFetch<{ invitees: Invitee[] }>(`/events/${eventId}/invitees`),
};
