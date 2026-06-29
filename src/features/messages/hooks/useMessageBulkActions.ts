import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { messagesClient } from "@/lib/api/messages-client";
import { useMessagesCount } from "@/lib/query/messagesQueries";
import { saveBlob } from "@/lib/utils/download-blob";
import { useEventId } from "../context/MessagesEventContext";
import { useMessageSelectAll, useSelectedIds } from "../store/useMessagesStore";
import { useMessageList } from "./useMessageList";

type BulkKind = "favorite" | "goldbook" | "download";

export const useMessageBulkActions = () => {
  const eventId = useEventId();
  const qc = useQueryClient();
  const { messageViews } = useMessageList();
  const selectedIds = useSelectedIds();
  const selectAll = useMessageSelectAll();

  const selectedViews = useMemo(
    () => messageViews.filter((m) => selectedIds.has(m.id)),
    [messageViews, selectedIds],
  );

  const allFavorited =
    !selectAll &&
    selectedViews.length > 0 &&
    selectedViews.every((m) => m.favorited);
  const allInGoldBook =
    !selectAll &&
    selectedViews.length > 0 &&
    selectedViews.every((m) => m.inGoldBook);
  const selectedDurationSec = selectedViews.reduce(
    (acc, m) => acc + m.durationSec,
    0,
  );

  const countQuery = useMessagesCount(eventId, {
    filter: selectAll?.filter,
    search: selectAll?.search,
  });
  const effectiveCount = selectAll
    ? Math.max(0, (countQuery.data?.count ?? 0) - selectAll.excludedIds.length)
    : selectedIds.size;

  const selector = selectAll ? { selectAll } : { ids: Array.from(selectedIds) };

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: queryKeys.messages.all(eventId) });
    qc.invalidateQueries({ queryKey: queryKeys.events.stats(eventId) });
  };

  const mutation = useMutation({
    mutationFn: async (kind: BulkKind) => {
      if (kind === "favorite") {
        await messagesClient.bulkUpdate(eventId, {
          ...selector,
          action: "favorite",
          value: !allFavorited,
        });
        return;
      }
      if (kind === "goldbook") {
        await messagesClient.bulkUpdate(eventId, {
          ...selector,
          action: "gold_book",
          value: !allInGoldBook,
        });
        return;
      }
      const blob = await messagesClient.bulkDownload(eventId, selector);
      saveBlob(blob, `messages-${eventId}.zip`);
    },
    onSuccess: invalidate,
  });

  return {
    bulkFavorite: () => mutation.mutate("favorite"),
    bulkAddToGoldBook: () => mutation.mutate("goldbook"),
    bulkDownload: () => mutation.mutate("download"),
    isPending: mutation.isPending,
    allFavorited,
    allInGoldBook,
    selectedCount: effectiveCount,
    selectedDurationSec: selectAll ? 0 : selectedDurationSec,
    isAllMode: Boolean(selectAll),
  };
};
