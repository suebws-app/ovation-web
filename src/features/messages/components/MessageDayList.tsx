"use client";

import type { MessageRowView } from "../adapters";
import { groupBy } from "@/lib/utils/array";
import { formatWeekdayDate } from "@/lib/utils/formatDate";
import { MessageDayHeader } from "./MessageDayHeader";
import { MessageDayListFooter } from "./MessageDayListFooter";
import { MessageRow } from "./MessageRow";

type MessageDayListProps = {
  messages: MessageRowView[];
  selectedIds: Set<string>;
  activeMessageId: string | null;
  playingId: string | null;
  isPlaying?: boolean;
  playingProgress?: number;
  playingCurrentTime?: number;
  onRowClick: (id: string) => void;
  onRowPlay?: (id: string) => void;
  onRowToggleSelect?: (id: string) => void;
};

const groupMessagesByDay = (messages: MessageRowView[]) =>
  groupBy(messages, (m) => formatWeekdayDate(m.createdAt)).map((g) => ({
    label: g.key,
    items: g.items,
  }));

export const MessageDayList = ({
  messages,
  selectedIds,
  activeMessageId,
  playingId,
  isPlaying = false,
  playingProgress = 0,
  playingCurrentTime = 0,
  onRowClick,
  onRowPlay,
  onRowToggleSelect,
}: MessageDayListProps) => {
  const groups = groupMessagesByDay(messages);
  const groupOffsets = groups.reduce<number[]>((acc, group, idx) => {
    const prev = idx === 0 ? 0 : acc[idx - 1] + groups[idx - 1].items.length;
    return [...acc, prev];
  }, []);
  const isHighlighted = (id: string) => id === activeMessageId;

  return (
    <div>
      {groups.map((group, groupIdx) => (
        <section key={group.label}>
          <MessageDayHeader
            day={group.label}
            date=""
            count={group.items.length}
          />
          {group.items.map((message, itemIdx) => (
            <MessageRow
              key={message.id}
              message={message}
              selected={isHighlighted(message.id)}
              checked={selectedIds.has(message.id)}
              isCurrent={message.id === playingId}
              playing={message.id === playingId && isPlaying}
              progress={message.id === playingId ? playingProgress : 0}
              currentTime={message.id === playingId ? playingCurrentTime : 0}
              index={groupOffsets[groupIdx] + itemIdx}
              onClick={() => onRowClick(message.id)}
              onPlay={onRowPlay ? () => onRowPlay(message.id) : undefined}
              onToggleSelect={
                onRowToggleSelect
                  ? () => onRowToggleSelect(message.id)
                  : undefined
              }
            />
          ))}
        </section>
      ))}
      <MessageDayListFooter />
    </div>
  );
};
