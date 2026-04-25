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
        <div className="border-border border-b py-5">
          <div className="type-caption text-muted-foreground mb-2 font-semibold">
            Welcome note
          </div>
          <div className="rounded-12 border-border bg-card type-body-small min-h-24 border p-3.5 leading-relaxed">
            <span className="text-primary font-serif italic">
              Hola! Bienvenue.
            </span>{" "}
            Leave us a message &mdash; a story, a song, a bad dance move.
            We&apos;ll cherish it.
            <span className="type-caption text-muted-foreground float-right">
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
          <KioskLanguageChip
            flag="\ud83c\uddf5\ud83c\uddf9"
            label="Portuguese"
            isMain
          />
          <KioskLanguageChip flag="\ud83c\uddec\ud83c\udde7" label="English" />
          <KioskLanguageChip flag="\ud83c\uddea\ud83c\uddf8" label="Spanish" />
          <KioskLanguageChip flag="\ud83c\uddeb\ud83c\uddf7" label="French" />
          <button
            type="button"
            className="border-border type-caption text-muted-foreground inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed px-3 py-2 font-semibold"
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
          <span className="border-border bg-card type-body-small rounded-full border px-3.5 py-2">
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
