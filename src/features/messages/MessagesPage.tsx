"use client";

import { useState, useCallback } from "react";
import { Button } from "@ovation/ui/components/Button";
import { Chip } from "@ovation/ui/components/Chip";
import { MessageToolbar } from "./components/MessageToolbar";
import { MessageRow } from "./components/MessageRow";
import { MessageDetailPane } from "./components/MessageDetailPane";
import { MessageBatchBar } from "./components/MessageBatchBar";

const TINTS = [
  "#EFC9A8",
  "#D8C9B2",
  "#B9C9D9",
  "#C8B5D9",
  "#F2D7B3",
  "#B8D3B6",
  "#E9BFC4",
  "#ADC4D1",
];

const generateWave = (seed: number) =>
  Array.from(
    { length: 48 },
    (_, i) => 0.2 + 0.8 * Math.abs(Math.sin(seed * 0.7 + i * 0.4)),
  );

const MOCK_MESSAGES = [
  {
    id: "1",
    name: "Margot Bellamy",
    relation: "Bride\u2019s aunt",
    initials: "MB",
    tint: TINTS[0],
    quote:
      "I watched you grow from a girl who dreamed in watercolours into a woman who paints the world.",
    transcript:
      "I watched you grow from a girl who dreamed in watercolours into a woman who paints the world. And now you have found someone who sees every shade. I wish you a lifetime of light, my darling. Your uncle Robert would have been so proud.",
    duration: "3:22",
    durationSec: 202,
    favorited: true,
    hasPhoto: true,
    listens: 8,
    time: "22:41",
    wave: generateWave(1),
  },
  {
    id: "2",
    name: "Carlos Rivera",
    relation: "Groom\u2019s best man",
    initials: "CR",
    tint: TINTS[1],
    quote:
      "Brother, you taught me that loyalty isn\u2019t loud \u2014 it\u2019s showing up, every time.",
    transcript:
      "Brother, you taught me that loyalty isn\u2019t loud \u2014 it\u2019s showing up, every time. From the football pitch in Sevilla to the altar today. I am so honoured to stand beside you. Lena, welcome to the chaos. You\u2019re gonna love it.",
    duration: "2:48",
    durationSec: 168,
    favorited: false,
    hasPhoto: false,
    language: "ES",
    listens: 5,
    time: "22:55",
    wave: generateWave(2),
  },
  {
    id: "3",
    name: "Johan & Els",
    relation: "Friends of the couple",
    initials: "JE",
    tint: TINTS[2],
    quote:
      "The way you two look at each other \u2014 like the room just got quieter.",
    transcript:
      "The way you two look at each other \u2014 like the room just got quieter. We\u2019ve known you separately and together, and together is where you both make sense. We\u2019re so happy for you. Now please save us a dance.",
    duration: "1:55",
    durationSec: 115,
    favorited: true,
    hasPhoto: true,
    listens: 12,
    time: "23:10",
    wave: generateWave(3),
  },
  {
    id: "4",
    name: "Nadia Okoro",
    relation: "Bride\u2019s colleague",
    initials: "NO",
    tint: TINTS[3],
    quote:
      "You brought the same kindness to every meeting room \u2014 imagine what you\u2019ll bring to a home.",
    transcript:
      "You brought the same kindness to every meeting room \u2014 imagine what you\u2019ll bring to a home. We all knew this day would come. I\u2019m so grateful to call you my friend, not just my teammate.",
    duration: "2:15",
    durationSec: 135,
    favorited: false,
    hasPhoto: false,
    listens: 3,
    time: "23:28",
    wave: generateWave(4),
  },
  {
    id: "5",
    name: "Finn McAllister",
    relation: "Groom\u2019s cousin",
    initials: "FM",
    tint: TINTS[4],
    quote:
      "Remember when we got lost in Galway? You said \u2018the best stories start with wrong turns.\u2019",
    transcript:
      "Remember when we got lost in Galway? You said \u2018the best stories start with wrong turns.\u2019 Well mate, looks like you took the best wrong turn of your life. Lena, you\u2019re stuck with us now. Cheers to the happy couple!",
    duration: "1:38",
    durationSec: 98,
    favorited: false,
    hasPhoto: true,
    listens: 6,
    time: "23:42",
    wave: generateWave(5),
  },
  {
    id: "6",
    name: "Elena V\u00e1squez",
    relation: "Bride\u2019s mother",
    initials: "EV",
    tint: TINTS[5],
    quote: "My baby girl, you have always been my greatest adventure.",
    transcript:
      "My baby girl, you have always been my greatest adventure. Watching you walk down that aisle today, I thought my heart would burst. Tom\u00e1s, thank you for making her smile the way only I used to be able to.",
    duration: "4:02",
    durationSec: 242,
    favorited: true,
    hasPhoto: true,
    listens: 22,
    time: "21:15",
    wave: generateWave(6),
  },
  {
    id: "7",
    name: "Pavel Novotn\u00fd",
    relation: "University friend",
    initials: "PN",
    tint: TINTS[6],
    quote:
      "We survived finals together \u2014 marriage should be easy after that.",
    transcript:
      "We survived finals together \u2014 marriage should be easy after that. But seriously, you two are the real deal. The kind of love that makes the rest of us believe. Congratulations, you beautiful humans.",
    duration: "1:12",
    durationSec: 72,
    favorited: false,
    hasPhoto: false,
    listens: 4,
    time: "00:05",
    wave: generateWave(7),
  },
  {
    id: "8",
    name: "Sophie Laurent",
    relation: "Wedding planner",
    initials: "SL",
    tint: TINTS[7],
    quote: "In ten years of weddings, yours was the first where I cried.",
    transcript:
      "In ten years of weddings, yours was the first where I cried. Not during the vows \u2014 during the first dance. The way he whispered something and you laughed? That\u2019s it. That\u2019s the whole thing.",
    duration: "1:45",
    durationSec: 105,
    favorited: true,
    hasPhoto: false,
    listens: 9,
    time: "00:22",
    wave: generateWave(8),
  },
];

const FILTER_CHIPS = [
  { label: "All", count: 87 },
  { label: "\u2665 Favourites", count: 14 },
  { label: "With photo", count: 64 },
  { label: "In book", count: 32 },
  { label: "Over 2 min", count: 19 },
];

const fmtDur = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
};

export const MessagesPage = () => {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeMessageId, setActiveMessageId] = useState<string>("3");
  const [playingId, setPlayingId] = useState<string>("1");

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectModeToggle = () => {
    if (selectMode) {
      setSelectedIds(new Set());
    }
    setSelectMode(!selectMode);
  };

  const handleRowClick = useCallback(
    (id: string) => {
      if (selectMode) {
        toggleSelect(id);
      } else {
        setActiveMessageId(id);
      }
    },
    [selectMode, toggleSelect],
  );

  const activeMessage =
    MOCK_MESSAGES.find((m) => m.id === activeMessageId) ?? MOCK_MESSAGES[0];

  const weddingNight = MOCK_MESSAGES.filter(
    (m) => !["00:05", "00:22"].includes(m.time),
  );
  const nextMorning = MOCK_MESSAGES.filter((m) =>
    ["00:05", "00:22"].includes(m.time),
  );

  const selectedDuration = MOCK_MESSAGES.filter((m) =>
    selectedIds.has(m.id),
  ).reduce((acc, m) => acc + m.durationSec, 0);

  return (
    <div className="-mx-4 -mb-6 tablet:-mb-10 desktop:-mb-20 grid min-h-screen large-desktop:grid-cols-[1fr_360px]">
      <div className="flex min-w-0 flex-col bg-card">
        <MessageToolbar />
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 tablet:px-7">
          <Button
            variant={selectMode ? "default" : "outline"}
            size="sm"
            onClick={handleSelectModeToggle}
            className="rounded-full"
          >
            {selectMode ? `Cancel (${selectedIds.size})` : "Select"}
          </Button>
          {selectMode && selectedIds.size > 0 && (
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="cursor-pointer type-caption font-semibold text-primary"
            >
              Clear all
            </button>
          )}
        </div>

        {selectMode && (
          <MessageBatchBar
            count={selectedIds.size}
            combinedDuration={fmtDur(selectedDuration)}
          />
        )}

        <div className="flex gap-2 overflow-auto border-b border-border bg-card px-4 py-3 large-desktop:hidden">
          {FILTER_CHIPS.map((c) => (
            <Chip
              key={c.label}
              label={c.label}
              count={c.count}
              active={activeFilter === c.label}
              onClick={() => setActiveFilter(c.label)}
            />
          ))}
        </div>

        <div className="flex-1 overflow-auto">
          <DayHeader
            day="Wedding night"
            date="14 Jun 2026"
            count={weddingNight.length}
          />
          {weddingNight.map((m, i) => (
            <MessageRow
              key={m.id}
              name={m.name}
              relation={m.relation}
              quote={m.quote}
              initials={m.initials}
              tint={m.tint}
              wave={m.wave}
              duration={m.duration}
              favorited={m.favorited}
              hasPhoto={m.hasPhoto}
              language={m.language}
              selected={
                selectMode ? selectedIds.has(m.id) : m.id === activeMessageId
              }
              playing={m.id === playingId}
              index={i}
              onClick={() => handleRowClick(m.id)}
            />
          ))}

          <DayHeader
            day="Next morning"
            date="15 Jun 2026"
            count={nextMorning.length}
          />
          {nextMorning.map((m, i) => (
            <MessageRow
              key={m.id}
              name={m.name}
              relation={m.relation}
              quote={m.quote}
              initials={m.initials}
              tint={m.tint}
              wave={m.wave}
              duration={m.duration}
              favorited={m.favorited}
              hasPhoto={m.hasPhoto}
              selected={
                selectMode ? selectedIds.has(m.id) : m.id === activeMessageId
              }
              playing={false}
              index={weddingNight.length + i}
              onClick={() => handleRowClick(m.id)}
            />
          ))}

          <div className="border-t border-border p-8 text-center type-body-small text-muted-foreground">
            You&apos;re all caught up.{" "}
            <button
              type="button"
              className="cursor-pointer font-semibold text-primary"
            >
              Share your QR code
            </button>{" "}
            to collect more.
          </div>
        </div>
      </div>

      <MessageDetailPane
        name={activeMessage.name}
        relation={activeMessage.relation}
        initials={activeMessage.initials}
        tint={activeMessage.tint}
        quote={activeMessage.quote}
        transcript={activeMessage.transcript}
        wave={activeMessage.wave}
        duration={activeMessage.duration}
        favorited={activeMessage.favorited}
        listens={activeMessage.listens}
      />
    </div>
  );
};

const DayHeader = ({
  day,
  date,
  count,
}: {
  day: string;
  date: string;
  count: number;
}) => (
  <div className="flex items-center gap-2.5 border-b border-border bg-background px-4 py-3 tablet:px-6">
    <span className="font-serif type-body font-semibold">{day}</span>
    <span className="type-caption text-muted-foreground">&middot; {date}</span>
    <span className="ml-auto rounded-full border border-border bg-card px-2 py-0.5 type-caption font-semibold text-muted-foreground">
      {count} {count === 1 ? "message" : "messages"}
    </span>
  </div>
);
