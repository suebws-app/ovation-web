"use client";

import { DashboardGreeting } from "./components/DashboardGreeting";
import { ResumeCard } from "./components/ResumeCard";
import { StatLine } from "./components/StatLine";
import { MessageList } from "./components/MessageList";
import { NudgeCard } from "./components/NudgeCard";

const MOCK_MESSAGES = [
  {
    id: "1",
    name: "Margot Devreese",
    relation: "Maid of honour",
    quote: "The way you look at her — like the room just got quieter.",
    initials: "M",
    tint: "#EFC9A8",
    wave: [
      0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 0.3, 0.8, 0.5, 0.7, 0.4, 0.9, 0.6, 0.3,
      0.8, 0.5, 0.7, 1, 0.4, 0.6, 0.9, 0.3, 0.7, 0.5, 0.8, 0.4, 0.6, 0.9, 0.3,
      0.7, 0.5,
    ],
  },
  {
    id: "2",
    name: "Joan Navarro",
    relation: "Best man",
    quote: "I knew from the first dinner. You two just made sense.",
    initials: "J",
    tint: "#779FEB",
    wave: [
      0.3, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 1, 0.5, 0.3, 0.8, 0.6, 0.4, 0.9, 0.7,
      0.5, 0.3, 0.8, 1, 0.6, 0.4, 0.7, 0.9, 0.5, 0.3, 0.6, 0.8, 0.4, 0.7, 1,
      0.5, 0.9,
    ],
  },
  {
    id: "3",
    name: "Angela Serra",
    relation: "Mother of the bride",
    quote: "Mi niña, you found someone who sees all of you.",
    initials: "A",
    tint: "#EC8662",
    wave: [
      0.6, 0.4, 0.8, 0.3, 0.9, 0.5, 0.7, 1, 0.4, 0.6, 0.3, 0.8, 0.5, 0.9, 0.7,
      0.4, 1, 0.6, 0.3, 0.8, 0.5, 0.7, 0.9, 0.4, 0.6, 1, 0.3, 0.8, 0.5, 0.7,
      0.4, 0.9,
    ],
  },
  {
    id: "4",
    name: "Elise Peeters",
    relation: "College friend",
    quote: "Remember Barcelona? That trip changed everything for you two.",
    initials: "E",
    tint: "#82E19D",
    wave: [
      0.9, 0.5, 0.7, 0.3, 0.8, 0.4, 0.6, 1, 0.5, 0.9, 0.3, 0.7, 0.4, 0.8, 0.6,
      1, 0.5, 0.3, 0.9, 0.7, 0.4, 0.8, 0.6, 0.5, 1, 0.3, 0.7, 0.9, 0.4, 0.8,
      0.6, 0.5,
    ],
  },
  {
    id: "5",
    name: "Carlos Ruiz",
    relation: "Cousin",
    quote: "La familia just grew, and we couldn't be happier about it.",
    initials: "C",
    tint: "#EDB974",
    wave: [
      0.5, 0.8, 0.3, 0.7, 0.9, 0.4, 0.6, 1, 0.3, 0.5, 0.8, 0.7, 0.4, 0.9, 0.6,
      0.5, 1, 0.3, 0.7, 0.8, 0.4, 0.6, 0.9, 0.5, 0.3, 0.7, 1, 0.8, 0.4, 0.6,
      0.9, 0.5,
    ],
  },
];

type DashboardHomeProps = {
  eventId: string;
};

export const DashboardHome = ({ eventId }: DashboardHomeProps) => {
  return (
    <div>
      <DashboardGreeting
        name="Lena"
        date="14 June 2026"
        venue="Mas de la Calma"
        newMessages={12}
      />

      <ResumeCard
        name="Margot Devreese"
        role="Maid of honour"
        pausedAt="1:14"
        duration="2:22"
        initials="M"
        tint="#EFC9A8"
      />

      <div className="mt-10">
        <StatLine />
      </div>

      <div className="mt-8">
        <MessageList messages={MOCK_MESSAGES} eventId={eventId} />
      </div>

      <div className="mt-12">
        <NudgeCard
          icon="✦"
          title="Your Gold Book is 80% ready"
          description="8 more quotes to approve before it goes to press."
          actionLabel="Open editor"
        />
      </div>
    </div>
  );
};
