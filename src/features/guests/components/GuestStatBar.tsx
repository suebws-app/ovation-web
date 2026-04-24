import { Users } from "@ovation/icons/Users";
import { Mic } from "@ovation/icons/Mic";
import { Hourglass } from "@ovation/icons/Hourglass";
import { XIcon } from "@ovation/icons/XIcon";
import { Mail } from "@ovation/icons/Mail";
import { GuestStatCard } from "./GuestStatCard";

const STATS = [
  {
    value: 112,
    label: "total guests",
    sub: "across 6 groups",
    icon: Users,
    tone: "primary" as const,
  },
  {
    value: 78,
    label: "contributed",
    sub: "voice, photo, or both",
    icon: Mic,
    tone: "primary" as const,
  },
  {
    value: 34,
    label: "still to hear",
    sub: "gentle nudge ready",
    icon: Hourglass,
    tone: "destructive" as const,
  },
  {
    value: 0,
    label: "declined",
    sub: "no one said no",
    icon: XIcon,
    tone: "muted" as const,
  },
  {
    value: 47,
    label: "thank-yous owed",
    sub: "addresses ready",
    icon: Mail,
    tone: "accent" as const,
  },
];

export const GuestStatBar = () => {
  return (
    <div className="grid grid-cols-2 gap-4 tablet:grid-cols-3 desktop:grid-cols-5">
      {STATS.map((stat) => (
        <GuestStatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};
