import { apiFetch } from "./server";
import type { LinkSettings, UpdateLinkSettingsInput } from "./types";

export const linkSettingsApi = {
  get: (eventId: string) =>
    apiFetch<{ settings: LinkSettings }>(`/events/${eventId}/link-settings`),

  update: (eventId: string, input: UpdateLinkSettingsInput) =>
    apiFetch<{ settings: LinkSettings }>(`/events/${eventId}/link-settings`, {
      method: "PATCH",
      body: input,
    }),
};
