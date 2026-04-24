"use client";

import { GuestHero } from "./components/GuestHero";
import { GuestStatBar } from "./components/GuestStatBar";
import { GuestFilterChips } from "./components/GuestFilterChips";
import { GuestDirectory } from "./components/GuestDirectory";
import { GuestGroupsStrip } from "./components/GuestGroupsStrip";
import { GuestNudgeCard } from "./components/GuestNudgeCard";
import { GuestThankYouCard } from "./components/GuestThankYouCard";

export const GuestsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <GuestHero />
      <GuestStatBar />
      <GuestFilterChips />
      <GuestDirectory />
      <GuestGroupsStrip />
      <div className="grid gap-5 desktop:grid-cols-[1.3fr_1fr]">
        <GuestNudgeCard />
        <GuestThankYouCard />
      </div>
    </div>
  );
};
