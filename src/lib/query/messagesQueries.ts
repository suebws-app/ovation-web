"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { messagesClient } from "@/lib/api/messages-client";
import type {
  ListMessagesQuery,
  MessageSummary,
  UpdateMessageInput,
} from "@/lib/api/types";
import type { Paginated } from "@/lib/api/client";
import { queryKeys } from "./keys";

export const useMessagesList = (
  eventId: string,
  input: ListMessagesQuery = {},
) =>
  useQuery({
    queryKey: queryKeys.messages.list(eventId, input),
    queryFn: () => messagesClient.list(eventId, input),
    enabled: Boolean(eventId),
  });

export const useMessageDetail = (eventId: string, messageId: string | null) =>
  useQuery({
    queryKey: queryKeys.messages.detail(eventId, messageId ?? ""),
    queryFn: () => messagesClient.get(eventId, messageId!),
    enabled: Boolean(eventId && messageId),
  });

type UpdateContext = {
  previous: [readonly unknown[], Paginated<MessageSummary> | undefined][];
};

export const useUpdateMessage = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation<
    { message: { id: string; isFavorite: boolean } },
    Error,
    { messageId: string; input: UpdateMessageInput },
    UpdateContext
  >({
    mutationFn: ({ messageId, input }) =>
      messagesClient.update(eventId, messageId, input),
    onMutate: async ({ messageId, input }) => {
      await qc.cancelQueries({ queryKey: queryKeys.messages.all(eventId) });
      const previous = qc.getQueriesData<Paginated<MessageSummary>>({
        queryKey: queryKeys.messages.all(eventId),
      });
      previous.forEach(([key, snapshot]) => {
        if (!snapshot) return;
        qc.setQueryData<Paginated<MessageSummary>>(key, {
          ...snapshot,
          items: snapshot.items.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  isFavorite:
                    typeof input.isFavorite === "boolean"
                      ? input.isFavorite
                      : m.isFavorite,
                }
              : m,
          ),
        });
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      context?.previous.forEach(([key, snapshot]) => {
        qc.setQueryData(key, snapshot);
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.messages.all(eventId) });
    },
  });
};

type DeleteContext = {
  previous: [readonly unknown[], Paginated<MessageSummary> | undefined][];
};

export const useDeleteMessage = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation<void, Error, string, DeleteContext>({
    mutationFn: (messageId) => messagesClient.remove(eventId, messageId),
    onMutate: async (messageId) => {
      await qc.cancelQueries({ queryKey: queryKeys.messages.all(eventId) });
      const previous = qc.getQueriesData<Paginated<MessageSummary>>({
        queryKey: queryKeys.messages.all(eventId),
      });
      previous.forEach(([key, snapshot]) => {
        if (!snapshot) return;
        qc.setQueryData<Paginated<MessageSummary>>(key, {
          ...snapshot,
          items: snapshot.items.filter((m) => m.id !== messageId),
        });
      });
      return { previous };
    },
    onError: (_err, _id, context) => {
      context?.previous.forEach(([key, snapshot]) => {
        qc.setQueryData(key, snapshot);
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.messages.all(eventId) });
    },
  });
};

export type { InfiniteData };
