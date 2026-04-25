"use client";

import { MESSAGE_NEXT_MORNING_TIMES, type MessageMock } from "../mocks";
import { MessageDayHeader } from "./MessageDayHeader";
import { MessageDayListFooter } from "./MessageDayListFooter";
import { MessageRow } from "./MessageRow";

type MessageDayListProps = {
  messages: MessageMock[];
  selectMode: boolean;
  selectedIds: Set<string>;
  activeMessageId: string;
  playingId: string;
  onRowClick: (id: string) => void;
};

export const MessageDayList = ({
  messages,
  selectMode,
  selectedIds,
  activeMessageId,
  playingId,
  onRowClick,
}: MessageDayListProps) => {
  const weddingNight = messages.filter(
    (m) => !MESSAGE_NEXT_MORNING_TIMES.includes(m.time),
  );
  const nextMorning = messages.filter((m) =>
    MESSAGE_NEXT_MORNING_TIMES.includes(m.time),
  );

  const isHighlighted = (id: string) =>
    selectMode ? selectedIds.has(id) : id === activeMessageId;

  return (
    <div className="flex-1 overflow-auto">
      <MessageDayHeader
        day="Wedding night"
        date="14 Jun 2026"
        count={weddingNight.length}
      />
      {weddingNight.map((message, index) => (
        <MessageRow
          key={message.id}
          message={message}
          selected={isHighlighted(message.id)}
          playing={message.id === playingId}
          index={index}
          onClick={() => onRowClick(message.id)}
        />
      ))}

      <MessageDayHeader
        day="Next morning"
        date="15 Jun 2026"
        count={nextMorning.length}
      />
      {nextMorning.map((message, index) => (
        <MessageRow
          key={message.id}
          message={message}
          selected={isHighlighted(message.id)}
          playing={false}
          index={weddingNight.length + index}
          onClick={() => onRowClick(message.id)}
        />
      ))}

      <MessageDayListFooter />
    </div>
  );
};
