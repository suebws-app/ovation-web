"use client";

import { ChevronDown } from "@ovation/icons/ChevronDown";
import { KioskConfigCard } from "./KioskConfigCard";
import { KioskConfigRow } from "./KioskConfigRow";
import { KioskToggle } from "./KioskToggle";

export const KioskConfigLeft = () => {
  return (
    <div className="flex flex-col gap-5">
      <KioskConfigCard
        title="What guests can leave"
        description="Pick one or more. Audio is the magic; a photo is the cherry."
      >
        <KioskConfigRow
          title="Audio message"
          description="60\u201390 seconds by default. Waveform preview while recording."
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
        <KioskConfigRow
          title="Photo snap"
          description="Front camera, one tap. Optional \u2014 they can skip."
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
        <KioskConfigRow
          title="Video message"
          description="Landscape video up to 60 seconds. Off by default \u2014 big uploads."
          last
        >
          <KioskToggle on={false} />
        </KioskConfigRow>
      </KioskConfigCard>

      <KioskConfigCard
        title="Time limits"
        description="Keep them tight \u2014 the best messages are short."
      >
        <div className="py-5">
          <div className="flex items-baseline justify-between">
            <span className="type-body-small font-semibold">
              Maximum recording length
            </span>
            <span className="type-body-small text-muted-foreground">
              <strong className="text-foreground">90 seconds</strong> &mdash;
              recommended
            </span>
          </div>
          <div className="bg-border relative mt-3.5 h-1.5 rounded-full">
            <div className="bg-primary absolute inset-y-0 left-0 w-[45%] rounded-full" />
            <div
              className="border-primary bg-card absolute top-1/2 size-5 -translate-y-1/2 rounded-full border-2 shadow-sm"
              style={{ left: "calc(45% - 10px)" }}
            />
          </div>
          <div className="type-caption text-muted-foreground mt-2 flex justify-between">
            <span>15s</span>
            <span>30s</span>
            <span>60s</span>
            <span>90s</span>
            <span>2m</span>
            <span>3m</span>
          </div>
        </div>
        <KioskConfigRow
          title="Auto-return to welcome"
          description="After the guest sends their message. Keeps the line moving."
          last
        >
          <span className="border-border bg-card type-body-small inline-flex items-center gap-2 rounded-full border px-3.5 py-2">
            5 seconds
            <ChevronDown
              width={12}
              height={12}
              className="text-muted-foreground"
            />
          </span>
        </KioskConfigRow>
      </KioskConfigCard>

      <KioskConfigCard
        title="Kiosk lock-down"
        description="Nobody should be able to scroll your camera roll."
      >
        <KioskConfigRow
          title="Full-screen lock"
          description="Hides the browser chrome. Requires three-finger press + passcode to exit."
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
        <KioskConfigRow
          title="Guided Access / Screen Pinning"
          description="iPhone: Settings \u2192 Accessibility \u2192 Guided Access. Android: pin-a-screen in task switcher."
        >
          <button
            type="button"
            className="border-border bg-card type-caption cursor-pointer rounded-full border px-3 py-2 font-semibold"
          >
            Show me how
          </button>
        </KioskConfigRow>
        <KioskConfigRow
          title="Exit passcode"
          description="Four digits. So a curious guest can\u2019t get out."
        >
          <span className="border-border bg-card type-body-small rounded-full border px-3.5 py-2 font-mono tracking-widest">
            &bull; &bull; &bull; &bull;
          </span>
        </KioskConfigRow>
        <KioskConfigRow
          title="Airplane mode warning"
          description="Warn us if the device goes offline so we can save messages locally."
          last
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
      </KioskConfigCard>
    </div>
  );
};
