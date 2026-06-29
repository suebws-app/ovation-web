import { clientFetch } from "./client";
import type {
  BulkReplaceInviteesInput,
  Invitee,
  InviteeInput,
  UpdateInviteeInput,
} from "./types";

const inviteesPath = (eventId: string) => `/events/${eventId}/invitees`;

export const inviteesClient = {
  list: (eventId: string) =>
    clientFetch<{ invitees: Invitee[] }>(inviteesPath(eventId)),

  create: (eventId: string, input: InviteeInput) =>
    clientFetch<{ invitee: Invitee }>(inviteesPath(eventId), {
      method: "POST",
      body: input,
    }),

  update: (eventId: string, inviteeId: string, input: UpdateInviteeInput) =>
    clientFetch<{ invitee: Invitee }>(`${inviteesPath(eventId)}/${inviteeId}`, {
      method: "PATCH",
      body: input,
    }),

  remove: (eventId: string, inviteeId: string) =>
    clientFetch<void>(`${inviteesPath(eventId)}/${inviteeId}`, {
      method: "DELETE",
    }),

  bulkReplace: (eventId: string, input: BulkReplaceInviteesInput) =>
    clientFetch<{ invitees: Invitee[] }>(inviteesPath(eventId), {
      method: "PUT",
      body: input,
    }),
};
