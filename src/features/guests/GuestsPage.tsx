import { GuestActions } from "./components/GuestActions";
import { GuestDirectory } from "./components/GuestDirectory";
import { GuestFilterChips } from "./components/GuestFilterChips";
import { GuestGroupsStrip } from "./components/GuestGroupsStrip";
import { GuestHero } from "./components/GuestHero";
import { GuestStatBar } from "./components/GuestStatBar";

export const GuestsPage = () => (
  <div className="flex flex-col gap-6">
    <GuestHero />
    <GuestStatBar />
    <GuestFilterChips />
    <GuestDirectory />
    <GuestGroupsStrip />
    <GuestActions />
  </div>
);
