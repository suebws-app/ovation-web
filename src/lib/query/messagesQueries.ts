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
  MessageDetail,
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
  previousLists: [readonly unknown[], Paginated<MessageSummary>][];
  previousDetail:
    | { key: readonly unknown[]; data: { message: MessageDetail } | undefined }
    | null;
};

export const useUpdateMessage = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation<
    {
      message: {
        id: string;
        isFavorite: boolean;
        isGoldBookSelected: boolean;
      };
    },
    Error,
    { messageId: string; input: UpdateMessageInput },
    UpdateContext
  >({
    mutationFn: ({ messageId, input }) =>
      messagesClient.update(eventId, messageId, input),
    onMutate: async ({ messageId, input }) => {
      await qc.cancelQueries({ queryKey: queryKeys.messages.all(eventId) });

      const previousLists = qc
        .getQueriesData<Paginated<MessageSummary>>({
          queryKey: queryKeys.messages.all(eventId),
        })
        .filter(
          (entry): entry is [readonly unknown[], Paginated<MessageSummary>] =>
            Array.isArray(entry[1]?.items),
        );
      previousLists.forEach(([key, snapshot]) => {
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
                  isGoldBookSelected:
                    typeof input.isGoldBookSelected === "boolean"
                      ? input.isGoldBookSelected
                      : m.isGoldBookSelected,
                }
              : m,
          ),
        });
      });

      const detailKey = queryKeys.messages.detail(eventId, messageId);
      const detailSnapshot = qc.getQueryData<{ message: MessageDetail }>(
        detailKey,
      );
      if (detailSnapshot) {
        qc.setQueryData<{ message: MessageDetail }>(detailKey, {
          message: {
            ...detailSnapshot.message,
            isFavorite:
              typeof input.isFavorite === "boolean"
                ? input.isFavorite
                : detailSnapshot.message.isFavorite,
            isGoldBookSelected:
              typeof input.isGoldBookSelected === "boolean"
                ? input.isGoldBookSelected
                : detailSnapshot.message.isGoldBookSelected,
            coupleNotes:
              input.coupleNotes !== undefined
                ? input.coupleNotes
                : detailSnapshot.message.coupleNotes,
            audioTrimStartSec:
              input.audioTrimStartSec !== undefined
                ? input.audioTrimStartSec
                : detailSnapshot.message.audioTrimStartSec,
            audioTrimEndSec:
              input.audioTrimEndSec !== undefined
                ? input.audioTrimEndSec
                : detailSnapshot.message.audioTrimEndSec,
          },
        });
      }

      return {
        previousLists,
        previousDetail: { key: detailKey, data: detailSnapshot },
      };
    },
    onError: (err, _vars, context) => {
      console.error("[useUpdateMessage] failed", err);
      context?.previousLists.forEach(([key, snapshot]) => {
        qc.setQueryData(key, snapshot);
      });
      if (context?.previousDetail) {
        qc.setQueryData(
          context.previousDetail.key,
          context.previousDetail.data,
        );
      }
    },
    onSuccess: (response, { messageId }) => {
      const detailKey = queryKeys.messages.detail(eventId, messageId);
      const current = qc.getQueryData<{ message: MessageDetail }>(detailKey);
      if (current) {
        qc.setQueryData<{ message: MessageDetail }>(detailKey, {
          message: {
            ...current.message,
            isFavorite: response.message.isFavorite,
            isGoldBookSelected: response.message.isGoldBookSelected,
          },
        });
      }
    },
    onSettled: (_data, _err, { messageId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.messages.all(eventId) });
      qc.invalidateQueries({
        queryKey: queryKeys.messages.detail(eventId, messageId),
      });
    },
  });
};

type DeleteContext = {
  previous: [readonly unknown[], Paginated<MessageSummary>][];
};

export const useDeleteMessage = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation<void, Error, string, DeleteContext>({
    mutationFn: (messageId) => messagesClient.remove(eventId, messageId),
    onMutate: async (messageId) => {
      await qc.cancelQueries({ queryKey: queryKeys.messages.all(eventId) });
      const previous = qc
        .getQueriesData<Paginated<MessageSummary>>({
          queryKey: queryKeys.messages.all(eventId),
        })
        .filter(
          (entry): entry is [readonly unknown[], Paginated<MessageSummary>] =>
            Array.isArray(entry[1]?.items),
        );
      previous.forEach(([key, snapshot]) => {
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

export const useRetranscribeMessage = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation<
    { jobId: string },
    Error,
    { messageId: string; language?: string }
  >({
    mutationFn: ({ messageId, language }) =>
      messagesClient.retranscribe(eventId, messageId, language),
    onSettled: (_data, _err, { messageId }) => {
      qc.invalidateQueries({
        queryKey: queryKeys.messages.detail(eventId, messageId),
      });
      qc.invalidateQueries({ queryKey: queryKeys.messages.all(eventId) });
    },
  });
};

export type { InfiniteData };
