"use client";

import type { MessageRowView } from "../adapters";
import { MessageDayHeader } from "./MessageDayHeader";
import { MessageDayListFooter } from "./MessageDayListFooter";
import { MessageRow } from "./MessageRow";

type MessageDayListProps = {
  messages: MessageRowView[];
  selectMode: boolean;
  selectedIds: Set<string>;
  activeMessageId: string | null;
  playingId: string | null;
  onRowClick: (id: string) => void;
};

const groupLabel = (createdAt: string): string => {
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "Earlier";
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const groupMessages = (messages: MessageRowView[]) => {
  const groups: { label: string; items: MessageRowView[] }[] = [];
  for (const m of messages) {
    const label = groupLabel(m.createdAt);
    const existing = groups.find((g) => g.label === label);
    if (existing) existing.items.push(m);
    else groups.push({ label, items: [m] });
  }
  return groups;
};

export const MessageDayList = ({
  messages,
  selectMode,
  selectedIds,
  activeMessageId,
  playingId,
  onRowClick,
}: MessageDayListProps) => {
  const groups = groupMessages(messages);
  const groupOffsets = groups.reduce<number[]>((acc, group, idx) => {
    const prev = idx === 0 ? 0 : acc[idx - 1] + groups[idx - 1].items.length;
    return [...acc, prev];
  }, []);
  const isHighlighted = (id: string) =>
    selectMode ? selectedIds.has(id) : id === activeMessageId;

  return (
    <div className="flex-1 overflow-auto">
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
              playing={message.id === playingId}
              index={groupOffsets[groupIdx] + itemIdx}
              onClick={() => onRowClick(message.id)}
            />
          ))}
        </section>
      ))}
      <MessageDayListFooter />
    </div>
  );
};
