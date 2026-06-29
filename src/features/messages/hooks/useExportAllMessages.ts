import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { messagesClient } from "@/lib/api/messages-client";
import {
  downloadManyMessages,
  type DownloadInputs,
} from "@/lib/media/downloadMessageAssets";
import type { MessageSummary } from "@/lib/api/types";
import { toIsoDate } from "@/lib/utils/formatDate";
import { useEventId } from "../context/MessagesEventContext";

const PAGE_LIMIT = 100;

const fetchAllSummaries = async (
  eventId: string,
): Promise<MessageSummary[]> => {
  const all: MessageSummary[] = [];
  let cursor: string | undefined;
  do {
    const page = await messagesClient.list(eventId, {
      cursor,
      limit: PAGE_LIMIT,
    });
    all.push(...page.items);
    cursor = page.nextCursor ?? undefined;
  } while (cursor);
  return all;
};

export const useExportAllMessages = () => {
  const eventId = useEventId();
  const t = useTranslations();
  const anonymous = t("common__anonymous");

  const mutation = useMutation({
    onError: (err) => {
      console.error("[exportAll] failed:", err);
    },
    mutationFn: async () => {
      const summaries = await fetchAllSummaries(eventId);
      if (summaries.length === 0) return;

      const { messages } = await messagesClient.bulkDetail(
        eventId,
        summaries.map((s) => s.id),
      );

      const inputs: DownloadInputs[] = messages.map((message) => {
        const photo = message.media.find((m) => m.type === "photo");
        const video = message.media.find((m) => m.type === "video");
        return {
          guestName: message.guestNames || anonymous,
          audioUrl: message.audioUrl,
          videoUrl: video?.url ?? null,
          photoUrl: photo?.url ?? null,
          writtenNote: message.writtenNote,
        };
      });

      const folderName = `messages ${toIsoDate(new Date())}`;
      await downloadManyMessages(inputs, folderName, folderName);
    },
  });

  return {
    exportAll: () => mutation.mutate(),
    isExporting: mutation.isPending,
  };
};
