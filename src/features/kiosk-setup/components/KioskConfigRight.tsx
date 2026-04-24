"use client";

import { Plus } from "@ovation/icons/Plus";
import { KioskConfigCard } from "./KioskConfigCard";
import { KioskConfigRow } from "./KioskConfigRow";
import { KioskToggle } from "./KioskToggle";
import { KioskLanguageChip } from "./KioskLanguageChip";

export const KioskConfigRight = () => {
  return (
    <div className="flex flex-col gap-5">
      <KioskConfigCard
        title="Welcome screen"
        description="What guests see before they tap record."
      >
        <div className="border-b border-border py-5">
          <div className="mb-2 type-caption font-semibold text-muted-foreground">
            Welcome note
          </div>
          <div className="min-h-24 rounded-12 border border-border bg-card p-3.5 type-body-small leading-relaxed">
            <span className="font-serif italic text-primary">
              Hola! Bienvenue.
            </span>{" "}
            Leave us a message &mdash; a story, a song, a bad dance move.
            We&apos;ll cherish it.
            <span className="float-right type-caption text-muted-foreground">
              112 / 180
            </span>
          </div>
        </div>
        <KioskConfigRow
          title="Show couple photo"
          description="Faded into the background behind your names."
        >
          <KioskToggle on={false} />
        </KioskConfigRow>
        <KioskConfigRow
          title="Language picker"
          description="Let guests switch before recording. We detect their device language first."
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
        <KioskConfigRow
          title="Ambient sound cue"
          description="A soft chime plays when a guest taps record. Friendly and clear."
          last
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
      </KioskConfigCard>

      <KioskConfigCard
        title="Languages on device"
        description="The main one is shown first. Add any your guests speak."
      >
        <div className="flex flex-wrap gap-2 py-5">
          <KioskLanguageChip flag="\ud83c\uddf5\ud83c\uddf9" label="Portuguese" isMain />
          <KioskLanguageChip flag="\ud83c\uddec\ud83c\udde7" label="English" />
          <KioskLanguageChip flag="\ud83c\uddea\ud83c\uddf8" label="Spanish" />
          <KioskLanguageChip flag="\ud83c\uddeb\ud83c\uddf7" label="French" />
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-2 type-caption font-semibold text-muted-foreground"
          >
            <Plus width={12} height={12} />
            Add language
          </button>
        </div>
      </KioskConfigCard>

      <KioskConfigCard
        title="Offline safety"
        description="Venue WiFi dies. We planned for it."
      >
        <KioskConfigRow
          title="Store messages locally if offline"
          description="Messages save to the device and sync the moment WiFi is back."
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
        <KioskConfigRow
          title="Max local storage"
          description="Roughly 200 audio messages at 90s each. You\u2019ll be fine."
        >
          <span className="rounded-full border border-border bg-card px-3.5 py-2 type-body-small">
            1.5 GB
          </span>
        </KioskConfigRow>
        <KioskConfigRow
          title="Notify us if sync falls behind"
          description="Email and push, if more than 20 messages are queued."
          last
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
      </KioskConfigCard>
    </div>
  );
};
