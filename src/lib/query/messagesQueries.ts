"use client";

import {
  useInfiniteQuery,
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

export const useInfiniteMessagesList = (
  eventId: string,
  input: Omit<ListMessagesQuery, "cursor"> = {},
) =>
  useInfiniteQuery({
    queryKey: queryKeys.messages.infiniteList(eventId, input),
    queryFn: ({ pageParam }) =>
      messagesClient.list(eventId, {
        ...input,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? null,
    enabled: Boolean(eventId),
  });

export const useMessageDetail = (eventId: string, messageId: string | null) =>
  useQuery({
    queryKey: queryKeys.messages.detail(eventId, messageId ?? ""),
    queryFn: () => messagesClient.get(eventId, messageId!),
    enabled: Boolean(eventId && messageId),
  });

type ListSnapshot = Paginated<MessageSummary>;
type InfiniteSnapshot = InfiniteData<Paginated<MessageSummary>, string | null>;

const isInfiniteSnapshot = (
  value: unknown,
): value is InfiniteSnapshot =>
  typeof value === "object" &&
  value !== null &&
  Array.isArray((value as { pages?: unknown }).pages);

const isFlatSnapshot = (value: unknown): value is ListSnapshot =>
  typeof value === "object" &&
  value !== null &&
  Array.isArray((value as { items?: unknown }).items);

const patchMessageInList = (
  list: ListSnapshot,
  messageId: string,
  patch: Partial<MessageSummary>,
): ListSnapshot => ({
  ...list,
  items: list.items.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
});

const removeMessageFromList = (
  list: ListSnapshot,
  messageId: string,
): ListSnapshot => ({
  ...list,
  items: list.items.filter((m) => m.id !== messageId),
});

type UpdateContext = {
  previousFlatLists: [readonly unknown[], ListSnapshot][];
  previousInfiniteLists: [readonly unknown[], InfiniteSnapshot][];
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

      const patch: Partial<MessageSummary> = {};
      if (typeof input.isFavorite === "boolean") {
        patch.isFavorite = input.isFavorite;
      }
      if (typeof input.isGoldBookSelected === "boolean") {
        patch.isGoldBookSelected = input.isGoldBookSelected;
      }

      const allEntries = qc.getQueriesData<unknown>({
        queryKey: queryKeys.messages.all(eventId),
      });

      const previousFlatLists: [readonly unknown[], ListSnapshot][] = [];
      const previousInfiniteLists: [readonly unknown[], InfiniteSnapshot][] = [];

      allEntries.forEach(([key, snapshot]) => {
        if (isInfiniteSnapshot(snapshot)) {
          previousInfiniteLists.push([key, snapshot]);
          qc.setQueryData<InfiniteSnapshot>(key, {
            ...snapshot,
            pages: snapshot.pages.map((p) =>
              patchMessageInList(p, messageId, patch),
            ),
          });
        } else if (isFlatSnapshot(snapshot)) {
          previousFlatLists.push([key, snapshot]);
          qc.setQueryData<ListSnapshot>(
            key,
            patchMessageInList(snapshot, messageId, patch),
          );
        }
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
        previousFlatLists,
        previousInfiniteLists,
        previousDetail: { key: detailKey, data: detailSnapshot },
      };
    },
    onError: (err, _vars, context) => {
      console.error("[useUpdateMessage] failed", err);
      context?.previousFlatLists.forEach(([key, snapshot]) => {
        qc.setQueryData(key, snapshot);
      });
      context?.previousInfiniteLists.forEach(([key, snapshot]) => {
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
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.messages.lists(eventId) });
    },
  });
};

type DeleteContext = {
  previousFlatLists: [readonly unknown[], ListSnapshot][];
  previousInfiniteLists: [readonly unknown[], InfiniteSnapshot][];
};

export const useDeleteMessage = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation<void, Error, string, DeleteContext>({
    mutationFn: (messageId) => messagesClient.remove(eventId, messageId),
    onMutate: async (messageId) => {
      await qc.cancelQueries({ queryKey: queryKeys.messages.all(eventId) });
      const allEntries = qc.getQueriesData<unknown>({
        queryKey: queryKeys.messages.all(eventId),
      });
      const previousFlatLists: [readonly unknown[], ListSnapshot][] = [];
      const previousInfiniteLists: [readonly unknown[], InfiniteSnapshot][] =
        [];
      allEntries.forEach(([key, snapshot]) => {
        if (isInfiniteSnapshot(snapshot)) {
          previousInfiniteLists.push([key, snapshot]);
          qc.setQueryData<InfiniteSnapshot>(key, {
            ...snapshot,
            pages: snapshot.pages.map((p) =>
              removeMessageFromList(p, messageId),
            ),
          });
        } else if (isFlatSnapshot(snapshot)) {
          previousFlatLists.push([key, snapshot]);
          qc.setQueryData<ListSnapshot>(
            key,
            removeMessageFromList(snapshot, messageId),
          );
        }
      });
      return { previousFlatLists, previousInfiniteLists };
    },
    onError: (_err, _id, context) => {
      context?.previousFlatLists.forEach(([key, snapshot]) => {
        qc.setQueryData(key, snapshot);
      });
      context?.previousInfiniteLists.forEach(([key, snapshot]) => {
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
