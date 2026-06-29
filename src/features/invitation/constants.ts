export const INVITATION_STEPS = ["design", "details", "guests"] as const;
export type InvitationStepId = (typeof INVITATION_STEPS)[number];

export const TOTAL_INVITATION_STEPS = INVITATION_STEPS.length;

export const INVITATION_STEP_LABEL_KEYS: Record<InvitationStepId, string> = {
  design: "invitation__step__design__label",
  details: "invitation__step__details__label",
  guests: "invitation__step__guests__label",
};

export const INVITATION_STEP_TITLES: Record<
  InvitationStepId,
  { a: string; b: string; sub: string }
> = {
  design: {
    a: "invitation__step__design__title_a",
    b: "invitation__step__design__title_b",
    sub: "invitation__step__design__subtitle",
  },
  details: {
    a: "invitation__step__details__title_a",
    b: "invitation__step__details__title_b",
    sub: "invitation__step__details__subtitle",
  },
  guests: {
    a: "invitation__step__guests__title_a",
    b: "invitation__step__guests__title_b",
    sub: "invitation__step__guests__subtitle",
  },
};

export const makeGuestId = () =>
  `g_${Math.floor(performance.now() * 1000).toString(36)}_${Math.floor(
    Math.random() * 1e6,
  ).toString(36)}`;
