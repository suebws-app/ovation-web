"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Table, TableBody, TableSkeleton } from "@ovation/ui/components/Table";
import { DownloadIcon } from "@ovation/icons/DownloadIcon";
import type { TAudioPlayer } from "@ovation/ui/hooks/useAudioPlayer";
import type { EventStats } from "@/lib/api/types";
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
import { MessagesDirectoryEmpty } from "./components/MessagesDirectoryEmpty";
import { MessagesTableRow } from "./components/MessagesTableRow";
import { messagesTableSkeletonColumns } from "./tableColumns";

const PAGE_SIZE = 20;

type MessagesDirectoryProps = {
  player: TAudioPlayer;
  stats: EventStats | null;
};

export const MessagesDirectory = ({
  player,
  stats,
}: MessagesDirectoryProps) => {
  const t = useTranslations();
  const eventId = useEventId();
  const anonymous = t("common__anonymous");
  const filter = useFilter();
  const sort = useMessageSort();
  const search = useMessageSearch();
  const selectedIds = useSelectedIds();
  const setFilter = useMessagesStore((s) => s.setFilter);
  const toggleSelected = useMessagesStore((s) => s.toggleSelected);
  const setSelectAll = useMessagesStore((s) => s.setSelectAll);
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

  const hasNoMessagesEver = stats?.totalMessages === 0;
  const isTrulyEmpty =
    hasNoMessagesEver ||
    (!isPending &&
      !isError &&
      messages.length === 0 &&
      filter === "all" &&
      !trimmedSearch &&
      !hasNextPage);

  const selectAllActive = selectAll !== null;
  const allSelected = selectAllActive;

  const handleToggleAll = () => {
    if (selectAllActive) {
      clearSelection();
      return;
    }
    clearSelection();
    setSelectAll({
      filter,
      search: trimmedSearch || undefined,
      excludedIds: [],
    });
  };

  const isMessageSelected = (id: string): boolean => {
    if (selectAll) return !selectAll.excludedIds.includes(id);
    return selectedIds.has(id);
  };

  const handleRowToggle = (id: string) => {
    if (!selectAll) {
      toggleSelected(id);
      return;
    }
    const excluded = new Set(selectAll.excludedIds);
    if (excluded.has(id)) excluded.delete(id);
    else excluded.add(id);
    setSelectAll({ ...selectAll, excludedIds: [...excluded] });
  };

  const renderBody = () => {
    if (isPending) {
      return (
        <TableSkeleton
          className="table-fixed"
          columns={messagesTableSkeletonColumns}
          rows={PAGE_SIZE / 2}
        />
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
    return (
      <Table className="table-fixed">
        <MessageTableHead
          allSelected={allSelected}
          onToggleAll={handleToggleAll}
        />
        <TableBody>
          {messages.map((message, i) => {
            const isCurrentTrack = player.playingId === message.id;
            const isPlaying = isCurrentTrack && player.isPlaying;
            return (
              <MessagesTableRow
                key={message.id}
                message={message}
                index={i}
                anonymousLabel={anonymous}
                selected={isMessageSelected(message.id)}
                isPlaying={isPlaying}
                progress={isCurrentTrack ? player.progress : 0}
                currentTime={isCurrentTrack ? player.currentTime : 0}
                onToggleSelect={() => handleRowToggle(message.id)}
                onOpen={() => setActiveMessageId(message.id)}
                onPlay={() => player.toggle(message.id)}
              />
            );
          })}
        </TableBody>
      </Table>
    );
  };

  if (isTrulyEmpty) {
    return <MessagesDirectoryEmpty eventId={eventId} />;
  }

  return (
    <DataDirectory
      chips={
        <MessageFilterChips
          eventId={eventId}
          active={filter}
          stats={stats}
          onSelect={setFilter}
        />
      }
      title={t("messages__directory__title")}
      actions={
        <>
          <MessageSearchInput />
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
