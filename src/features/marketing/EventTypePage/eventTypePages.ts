import type { EventType } from "@/lib/event-types";

export type EventTypePageConfig = {
  slug: string;
  eventType: EventType;
  heroImage: string;
  introImage: string;
  benefitCount: number;
  faqCount: number;
};

export const EVENT_TYPE_PAGES: EventTypePageConfig[] = [
  {
    slug: "wedding",
    eventType: "wedding",
    heroImage: "/images/general/gen-wedding-party.webp",
    introImage: "/images/general/gen-wedding.webp",
    benefitCount: 3,
    faqCount: 4,
  },
  {
    slug: "birthday",
    eventType: "birthday",
    heroImage: "/images/general/gen-birthday.jpg",
    introImage: "/images/hero_cheers.webp",
    benefitCount: 3,
    faqCount: 4,
  },
  {
    slug: "corporate",
    eventType: "corporate",
    heroImage: "/images/general/gen-corporate.jpg",
    introImage: "/images/laptop_dashboard.webp",
    benefitCount: 3,
    faqCount: 4,
  },
  {
    slug: "baby-shower",
    eventType: "baby_shower",
    heroImage: "/images/general/gen-baby.png",
    introImage: "/images/hero_hands.webp",
    benefitCount: 3,
    faqCount: 4,
  },
  {
    slug: "anniversary",
    eventType: "anniversary",
    heroImage: "/images/general/gen-anniversary.jpg",
    introImage: "/images/general/gen-anniversary-2.avif",
    benefitCount: 3,
    faqCount: 4,
  },
  {
    slug: "memorial",
    eventType: "memorial",
    heroImage: "/images/general/gen-memorial.avif",
    introImage: "/images/hero_hands.webp",
    benefitCount: 3,
    faqCount: 4,
  },
  {
    slug: "graduation",
    eventType: "graduation",
    heroImage: "/images/general/gen-graduation.jpg",
    introImage: "/images/hero_girl.webp",
    benefitCount: 3,
    faqCount: 4,
  },
  {
    slug: "any-event",
    eventType: "other",
    heroImage: "/images/hero_cheers.webp",
    introImage: "/images/hero_hug.webp",
    benefitCount: 3,
    faqCount: 4,
  },
];

export const findEventTypePage = (
  slug: string,
): EventTypePageConfig | undefined =>
  EVENT_TYPE_PAGES.find((page) => page.slug === slug);
