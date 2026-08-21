import { OCCASIONS } from "@/features/marketing/GeneralShowcasePage/constants";

export const HERO_OCCASION_SUFFIXES = OCCASIONS.map(
  (occasion) => `hero_occasion_${occasion.key}`,
);

export const HERO_STAR_POSITIONS = [1, 2, 3, 4, 5];

export const HERO_THUMBS = [
  "/images/general/gen-wedding-party.webp",
  "/images/hero_cheers.webp",
  "/images/hero_hands.webp",
];

export const HERO_PHONE_GRID = [
  "/images/general/gen-birthday.jpg",
  "/images/hero_cheers.webp",
  "/images/general/gen-graduation.jpg",
  "/images/hero_hands.webp",
  "/images/general/gen-anniversary.jpg",
  "/images/hero_girl.webp",
  "/images/general/gen-wedding.webp",
  "/images/hero_hug.webp",
  "/images/general/gen-corporate.jpg",
];

export const TYPEWRITER_TYPE_MS = 90;
export const TYPEWRITER_DELETE_MS = 45;
export const TYPEWRITER_HOLD_MS = 1600;

export const HERO_PHONE_SCREEN_INSET = {
  left: "9.39%",
  top: "4.82%",
  width: "81.23%",
  height: "90.36%",
} as const;
