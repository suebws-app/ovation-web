import type { PublicEvent } from "@/lib/api/types";
import { HeroDetails } from "./HeroDetails";

type GuestHeroProps = {
  event: PublicEvent;
};

export const GuestHero = ({ event }: GuestHeroProps) => (
  <div className="flex flex-col gap-6.5">
    <HeroDetails event={event} />
  </div>
);
