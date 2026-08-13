import type { PublicEvent } from "@/lib/api/types";
import { HeroDetails } from "./HeroDetails";
import { HeroLogo } from "./HeroLogo";
import { HeroPhoto } from "./HeroPhoto";
import { WelcomeQuote } from "./WelcomeQuote";

type GuestHeroProps = {
  event: PublicEvent;
};

export const GuestHero = ({ event }: GuestHeroProps) => {
  const orgName = event.hostAName ?? event.partnerAName;
  const logoUrl =
    event.eventType === "corporate" &&
    typeof event.details?.logo === "string" &&
    event.details.logo
      ? event.details.logo
      : null;

  return (
    <div className="gap-6_5 flex flex-col">
      {logoUrl ? (
        <HeroLogo logoUrl={logoUrl} orgName={orgName} />
      ) : (
        <HeroPhoto
          hostAName={orgName}
          hostBName={event.hostBName ?? event.partnerBName}
          themeColor={event.themeColor}
          coverPhotoUrl={event.coverPhotoUrl ?? event.couplePhotoUrl}
        />
      )}
      <HeroDetails event={event} />
      <WelcomeQuote event={event} />
    </div>
  );
};
