import { Link } from "@/i18n/navigation";
import { MessageRow } from "./MessageRow";

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

export const MessageList = () => {
  const messages = MOCK_MESSAGES;
  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="font-serif text-[1.75rem] font-semibold">
          New messages
        </h2>
        <Link
          href={`/messages`}
          className="type-body-small font-semibold text-primary"
        >
          See all 87 &rarr;
        </Link>
      </div>

      <div className="overflow-hidden rounded-20 border border-border bg-card">
        {messages.map((m, i) => (
          <MessageRow key={m.id} {...m} index={i} />
        ))}
      </div>
    </div>
  );
};
