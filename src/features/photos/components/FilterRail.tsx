"use client";

import { cn } from "@ovation/ui/utils/cn";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Avatar } from "@ovation/ui/components/Avatar";
import { Button } from "@ovation/ui/components/Button";

const ALBUMS = [
  { label: "All photos", count: 64, active: true },
  { label: "Favourites", count: 12 },
  { label: "Couple only", count: 9 },
  { label: "Groups", count: 18 },
  { label: "Family", count: 21 },
  { label: "With audio", count: 42 },
];

const TIMELINE = [
  { label: "Getting ready", time: "14 Jun \u00b7 morning", count: 11 },
  { label: "Ceremony", time: "14 Jun \u00b7 16:30", count: 18 },
  { label: "Reception", time: "14 Jun \u00b7 19:00", count: 23, active: true },
  { label: "Party", time: "14 Jun \u00b7 22:00", count: 10 },
  { label: "Morning-after", time: "15 Jun", count: 2 },
];

const PEOPLE = [
  { name: "Margot", initials: "M", tint: "#EFC9A8" },
  { name: "Joan", initials: "J", tint: "#779FEB" },
  { name: "Angela", initials: "A", tint: "#EC8662" },
  { name: "Elise", initials: "E", tint: "#82E19D" },
  { name: "Carlos", initials: "C", tint: "#EDB974" },
  { name: "Marco", initials: "MB", tint: "#B8D3B6" },
];

export const FilterRail = () => (
  <div className="border-border bg-background large-desktop:block hidden overflow-auto border-r p-4.5">
    <Eyebrow className="text-muted-foreground px-2 pb-2">Albums</Eyebrow>
    {ALBUMS.map((a) => (
      <AlbumItem key={a.label} {...a} />
    ))}

    <Eyebrow className="text-muted-foreground px-2 pt-5 pb-2">
      Day timeline
    </Eyebrow>
    {TIMELINE.map((t) => (
      <TimelineItem key={t.label} {...t} />
    ))}

    <Eyebrow className="text-muted-foreground px-2 pt-5 pb-2">
      People detected
    </Eyebrow>
    <div className="flex flex-wrap gap-1.5 px-2">
      {PEOPLE.map((p) => (
        <PersonChip key={p.name} {...p} />
      ))}
      <span className="border-border type-caption text-muted-foreground inline-flex items-center rounded-full border border-dashed px-2.5 py-1 font-semibold">
        + 46 more
      </span>
    </div>

    <div className="rounded-12 border-accent from-accent/10 to-destructive/10 mt-6 border border-dashed bg-gradient-to-br p-3.5">
      <p className="type-caption text-foreground font-semibold">
        Pair photos with voices automatically.
      </p>
      <p className="type-caption text-muted-foreground mt-1">
        22 photos still unmatched — tap to review suggestions.
      </p>
      <Button
        size="sm"
        className="bg-foreground text-background hover:bg-foreground/90 mt-2.5 rounded-full"
      >
        Review matches
      </Button>
    </div>

    <div className="rounded-12 border-border bg-card mt-4 border p-3.5">
      <Eyebrow className="text-muted-foreground">Storage</Eyebrow>
      <p className="type-body-large mt-1.5 font-serif font-semibold">
        1.2{" "}
        <span className="type-caption text-muted-foreground font-medium italic">
          / 5 GB
        </span>
      </p>
      <div className="bg-border mt-1.5 h-1 overflow-hidden rounded-full">
        <div className="bg-primary h-full w-[24%] rounded-full" />
      </div>
    </div>
  </div>
);

const AlbumItem = ({
  label,
  count,
  active = false,
}: {
  label: string;
  count: number;
  active?: boolean;
}) => (
  <div
    className={cn(
      "rounded-10 type-body-small mb-0.5 flex cursor-pointer items-center gap-2.5 px-2.5 py-2.5 transition-colors",
      active
        ? "border-border bg-card text-foreground border font-semibold"
        : "text-muted-foreground hover:bg-muted",
    )}
  >
    <span className="flex-1">{label}</span>
    <span className="type-caption text-muted-foreground font-semibold">
      {count}
    </span>
  </div>
);

const TimelineItem = ({
  label,
  time,
  count,
  active = false,
}: {
  label: string;
  time: string;
  count: number;
  active?: boolean;
}) => (
  <div
    className={cn(
      "rounded-10 mb-0.5 flex cursor-pointer items-center gap-2.5 px-2.5 py-2 transition-colors",
      active ? "bg-primary/10" : "hover:bg-muted",
    )}
  >
    <div
      className={cn(
        "w-1 self-stretch rounded-full",
        active ? "bg-primary" : "bg-border",
      )}
    />
    <div className="min-w-0 flex-1">
      <p
        className={cn(
          "type-caption truncate",
          active ? "text-foreground font-semibold" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p className="type-caption text-muted-foreground">{time}</p>
    </div>
    <span className="type-caption text-muted-foreground font-semibold">
      {count}
    </span>
  </div>
);

const PersonChip = ({
  name,
  initials,
  tint,
}: {
  name: string;
  initials: string;
  tint: string;
}) => (
  <span className="border-border bg-card type-caption text-muted-foreground hover:bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-full border py-1 pr-2.5 pl-1 font-semibold transition-colors">
    <Avatar
      initials={initials}
      tint={tint}
      size="sm"
      className="type-caption size-5"
    />
    {name}
  </span>
);
