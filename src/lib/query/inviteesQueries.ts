"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invitationsClient } from "@/lib/api/invitations-client";
import { inviteesClient } from "@/lib/api/invitees-client";
import type {
  BulkReplaceInviteesInput,
  Invitee,
  InviteeInput,
  UpdateInviteeInput,
} from "@/lib/api/types";
import { queryKeys } from "./keys";

export const useInvitees = (eventId: string | null | undefined) =>
  useQuery({
    queryKey: queryKeys.invitees.list(eventId ?? ""),
    queryFn: () => inviteesClient.list(eventId!),
    enabled: Boolean(eventId),
    select: (data) => data.invitees,
  });

export const useCreateInvitee = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InviteeInput) => inviteesClient.create(eventId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.invitees.all(eventId),
      });
    },
  });
};

export const useUpdateInvitee = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      inviteeId,
      input,
    }: {
      inviteeId: string;
      input: UpdateInviteeInput;
    }) => inviteesClient.update(eventId, inviteeId, input),
    onSuccess: (response) => {
      queryClient.setQueryData<{ invitees: Invitee[] }>(
        queryKeys.invitees.list(eventId),
        (prev) => {
          if (!prev) return prev;
          return {
            invitees: prev.invitees.map((invitee) =>
              invitee.id === response.invitee.id ? response.invitee : invitee,
            ),
          };
        },
      );
    },
  });
};

export const useDeleteInvitee = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteeId: string) =>
      inviteesClient.remove(eventId, inviteeId).then(() => inviteeId),
    onSuccess: (inviteeId) => {
      queryClient.setQueryData<{ invitees: Invitee[] }>(
        queryKeys.invitees.list(eventId),
        (prev) => {
          if (!prev) return prev;
          return {
            invitees: prev.invitees.filter(
              (invitee) => invitee.id !== inviteeId,
            ),
          };
        },
      );
    },
  });
};

const markInviteesSent = (
  queryClient: ReturnType<typeof useQueryClient>,
  eventId: string,
  predicate: (invitee: Invitee) => boolean,
) => {
  const stampedAt = new Date().toISOString();
  queryClient.setQueryData<{ invitees: Invitee[] }>(
    queryKeys.invitees.list(eventId),
    (prev) => {
      if (!prev) return prev;
      return {
        invitees: prev.invitees.map((invitee) =>
          predicate(invitee) ? { ...invitee, lastSentAt: stampedAt } : invitee,
        ),
      };
    },
  );
};

export const useSendInvitationToInvitee = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteeId: string) =>
      invitationsClient.sendToInvitee(eventId, inviteeId),
    onSuccess: (_data, inviteeId) => {
      markInviteesSent(
        queryClient,
        eventId,
        (invitee) => invitee.id === inviteeId,
      );
    },
  });
};

export const useSendInvitationsToAll = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => invitationsClient.sendAll(eventId),
    onSuccess: () => {
      markInviteesSent(
        queryClient,
        eventId,
        (invitee) => Boolean(invitee.email) && !invitee.lastSentAt,
      );
    },
  });
};

export const useCopyInvitationLink = (eventId: string) =>
  useMutation({
    mutationFn: (inviteeId: string) =>
      invitationsClient.copyLink(eventId, inviteeId),
  });

export const useBulkReplaceInvitees = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BulkReplaceInviteesInput) =>
      inviteesClient.bulkReplace(eventId, input),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.invitees.list(eventId), response);
    },
  });
};
