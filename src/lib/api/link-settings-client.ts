import { clientFetch } from "./client";
import type { LinkSettings, UpdateLinkSettingsInput } from "./types";

export const linkSettingsClient = {
  get: (eventId: string) =>
    clientFetch<{ settings: LinkSettings }>(`/events/${eventId}/link-settings`),

  update: (eventId: string, input: UpdateLinkSettingsInput) =>
    clientFetch<{ settings: LinkSettings }>(
      `/events/${eventId}/link-settings`,
      { method: "PATCH", body: input },
    ),
};
