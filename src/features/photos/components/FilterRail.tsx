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
  <div className="hidden overflow-auto border-r border-border bg-background p-4.5 large-desktop:block">
    <Eyebrow className="px-2 pb-2 text-muted-foreground">Albums</Eyebrow>
    {ALBUMS.map((a) => (
      <AlbumItem key={a.label} {...a} />
    ))}

    <Eyebrow className="px-2 pb-2 pt-5 text-muted-foreground">
      Day timeline
    </Eyebrow>
    {TIMELINE.map((t) => (
      <TimelineItem key={t.label} {...t} />
    ))}

    <Eyebrow className="px-2 pb-2 pt-5 text-muted-foreground">
      People detected
    </Eyebrow>
    <div className="flex flex-wrap gap-1.5 px-2">
      {PEOPLE.map((p) => (
        <PersonChip key={p.name} {...p} />
      ))}
      <span className="inline-flex items-center rounded-full border border-dashed border-border px-2.5 py-1 type-caption font-semibold text-muted-foreground">
        + 46 more
      </span>
    </div>

    <div className="mt-6 rounded-12 border border-dashed border-accent bg-gradient-to-br from-accent/10 to-destructive/10 p-3.5">
      <p className="type-caption font-semibold text-foreground">
        Pair photos with voices automatically.
      </p>
      <p className="mt-1 type-caption text-muted-foreground">
        22 photos still unmatched — tap to review suggestions.
      </p>
      <Button
        size="sm"
        className="mt-2.5 rounded-full bg-foreground text-background hover:bg-foreground/90"
      >
        Review matches
      </Button>
    </div>

    <div className="mt-4 rounded-12 border border-border bg-card p-3.5">
      <Eyebrow className="text-muted-foreground">Storage</Eyebrow>
      <p className="mt-1.5 font-serif type-body-large font-semibold">
        1.2{" "}
        <span className="type-caption italic font-medium text-muted-foreground">
          / 5 GB
        </span>
      </p>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-border">
        <div className="h-full w-[24%] rounded-full bg-primary" />
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
      "mb-0.5 flex cursor-pointer items-center gap-2.5 rounded-10 px-2.5 py-2.5 type-body-small transition-colors",
      active
        ? "border border-border bg-card font-semibold text-foreground"
        : "text-muted-foreground hover:bg-muted",
    )}
  >
    <span className="flex-1">{label}</span>
    <span className="type-caption font-semibold text-muted-foreground">
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
      "mb-0.5 flex cursor-pointer items-center gap-2.5 rounded-10 px-2.5 py-2 transition-colors",
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
          "truncate type-caption",
          active ? "font-semibold text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p className="type-caption text-muted-foreground">{time}</p>
    </div>
    <span className="type-caption font-semibold text-muted-foreground">
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
  <span className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card py-1 pr-2.5 pl-1 type-caption font-semibold text-muted-foreground transition-colors hover:bg-muted">
    <Avatar
      initials={initials}
      tint={tint}
      size="sm"
      className="size-5 type-caption"
    />
    {name}
  </span>
);
