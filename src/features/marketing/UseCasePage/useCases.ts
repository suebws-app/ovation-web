export type UseCase = {
  slug: string;
  stepCount: number;
  faqCount: number;
};

export const USE_CASES: UseCase[] = [
  { slug: "voice-guest-book", stepCount: 4, faqCount: 3 },
  { slug: "guest-photos", stepCount: 4, faqCount: 2 },
  { slug: "thank-you-cards", stepCount: 3, faqCount: 1 },
  { slug: "wedding-toasts", stepCount: 3, faqCount: 1 },
  { slug: "multi-language-weddings", stepCount: 3, faqCount: 1 },
];

export const findUseCase = (slug: string): UseCase | undefined =>
  USE_CASES.find((u) => u.slug === slug);
