import { clientFetch } from "./client";

export type ReferralSummary = {
  code: string;
  invitedCount: number;
  convertedCount: number;
  creditBalanceCents: number;
  rewardCents: number;
};

export const referralsClient = {
  me: () =>
    clientFetch<{ referral: ReferralSummary }>("/referrals/me").then(
      (r) => r.referral,
    ),
};
