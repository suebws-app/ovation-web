import { GuestNudgeCard } from "./GuestNudgeCard";
import { GuestThankYouCard } from "./GuestThankYouCard";

export const GuestActions = () => (
  <div className="grid gap-5 desktop:grid-cols-[1.3fr_1fr]">
    <GuestNudgeCard />
    <GuestThankYouCard />
  </div>
);
