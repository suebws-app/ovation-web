export const BOOK_STEPS = ["format", "photos", "cover"] as const;
export type BookStepId = (typeof BOOK_STEPS)[number];

export const TOTAL_BOOK_STEPS = BOOK_STEPS.length;

export const BOOK_STEP_LABEL_KEYS: Record<BookStepId, string> = {
  photos: "keepsakes__book_customizer__step__photos__label",
  format: "keepsakes__book_customizer__step__format__label",
  cover: "keepsakes__book_customizer__step__cover__label",
};
