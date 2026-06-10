"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { DownloadIcon } from "@ovation/icons/DownloadIcon";
import type { TAudioPlayer } from "@ovation/ui/hooks/useAudioPlayer";
import { DataDirectory } from "@/components/DataDirectory";
import { InfiniteScrollSentinel } from "@/components/InfiniteScrollSentinel";
import { useInfiniteMessagesList } from "@/lib/query/messagesQueries";
import { useExportAllMessages } from "./hooks/useExportAllMessages";
import {
  useFilter,
  useMessageSearch,
  useMessageSort,
  useMessagesStore,
  useSelectedIds,
} from "./store/useMessagesStore";
import { useEventId } from "./context/MessagesEventContext";
import { MessageFilterChips } from "./components/MessageFilterChips";
import { MessageSearchInput } from "./components/MessageSearchInput";
import { MessageSortButton } from "./components/MessageSortButton";
import { MessageTableHead } from "./components/MessageTableHead";
import { MessagesTableRow } from "./components/MessagesTableRow";

const PAGE_SIZE = 20;

type MessagesDirectoryProps = {
  player: TAudioPlayer;
};

export const MessagesDirectory = ({ player }: MessagesDirectoryProps) => {
  const t = useTranslations();
  const eventId = useEventId();
  const anonymous = t("common__anonymous");
  const filter = useFilter();
  const sort = useMessageSort();
  const search = useMessageSearch();
  const selectedIds = useSelectedIds();
  const setFilter = useMessagesStore((s) => s.setFilter);
  const toggleSelected = useMessagesStore((s) => s.toggleSelected);
  const selectAll = useMessagesStore((s) => s.selectAll);
  const clearSelection = useMessagesStore((s) => s.clearSelection);
  const setActiveMessageId = useMessagesStore((s) => s.setActiveMessageId);

  const trimmedSearch = search.trim();
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMessagesList(eventId, {
    filter,
    sort,
    search: trimmedSearch || undefined,
    limit: PAGE_SIZE,
  });

  const { exportAll, isExporting } = useExportAllMessages();

  const messages = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.items),
    [data?.pages],
  );

  const allSelected =
    messages.length > 0 && messages.every((m) => selectedIds.has(m.id));

  const handleToggleAll = () => {
    if (allSelected) clearSelection();
    else selectAll(messages.map((m) => m.id));
  };

  const renderBody = () => {
    if (isPending) {
      return (
        <p className="type-body-small text-muted-foreground p-8 text-center">
          {t("messages__loading")}
        </p>
      );
    }
    if (isError) {
      return (
        <p className="type-body-small text-destructive p-8 text-center">
          {t("messages__error")}
        </p>
      );
    }
    if (messages.length === 0) {
      const empty = trimmedSearch
        ? t("messages__directory__no_search_results", { query: search })
        : t("messages__directory__empty_body");
      return (
        <p className="type-body-small text-muted-foreground p-8 text-center">
          {empty}
        </p>
      );
    }
    return messages.map((message, i) => {
      const isCurrentTrack = player.playingId === message.id;
      const isPlaying = isCurrentTrack && player.isPlaying;
      return (
        <MessagesTableRow
          key={message.id}
          message={message}
          index={i}
          anonymousLabel={anonymous}
          selected={selectedIds.has(message.id)}
          isPlaying={isPlaying}
          progress={isCurrentTrack ? player.progress : 0}
          currentTime={isCurrentTrack ? player.currentTime : 0}
          onToggleSelect={() => toggleSelected(message.id)}
          onOpen={() => setActiveMessageId(message.id)}
          onPlay={() => player.toggle(message.id)}
          isLast={i === messages.length - 1}
        />
      );
    });
  };

  return (
    <DataDirectory
      chips={
        <MessageFilterChips
          messages={messages}
          active={filter}
          onSelect={setFilter}
        />
      }
      title={t("messages__directory__title")}
      actions={
        <>
          <MessageSearchInput className="tablet:w-56 w-full min-w-0 flex-1" />
          <MessageSortButton />
          <Button
            size="sm"
            className="rounded-full"
            disabled={messages.length === 0 || isExporting}
            onClick={exportAll}
          >
            <DownloadIcon width={13} height={13} />
            {t("messages__toolbar__export_all")}
          </Button>
        </>
      }
      tableHead={
        messages.length > 0 ? (
          <MessageTableHead
            allSelected={allSelected}
            onToggleAll={handleToggleAll}
          />
        ) : null
      }
      bottomSlot={
        <InfiniteScrollSentinel
          hasNextPage={Boolean(hasNextPage)}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
          loadingLabel={t("messages__directory__loading_more")}
        />
      }
    >
      {renderBody()}
    </DataDirectory>
  );
};
