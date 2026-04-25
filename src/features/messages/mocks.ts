import type { FilterChipItem } from "@/components/FilterChipRail";

export type MessageMock = {
  id: string;
  name: string;
  relation: string;
  initials: string;
  tint: string;
  quote: string;
  transcript: string;
  duration: string;
  durationSec: number;
  favorited: boolean;
  hasPhoto: boolean;
  language?: string;
  listens: number;
  time: string;
  wave: number[];
};

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

export const MOCK_MESSAGES: MessageMock[] = [
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

export const MESSAGE_FILTER_CHIPS: FilterChipItem[] = [
  { label: "All", count: 87 },
  { label: "\u2665 Favourites", count: 14 },
  { label: "With photo", count: 64 },
  { label: "In book", count: 32 },
  { label: "Over 2 min", count: 19 },
];

export const MESSAGE_NEXT_MORNING_TIMES = ["00:05", "00:22"];
