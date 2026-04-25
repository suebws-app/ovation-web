"use client";

import { Button } from "@ovation/ui/components/Button";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Waveform } from "@/features/dashboard/components/Waveform";

type DetailPaneProps = {
  monogram: string;
  tint: string;
  name: string;
  relation: string;
  quote: string;
  wave: number[];
};

export const DetailPane = ({
  monogram,
  tint,
  name,
  relation,
  quote,
  wave,
}: DetailPaneProps) => (
  <div className="border-border bg-background large-desktop:flex hidden flex-col gap-4 overflow-auto border-l p-5">
    <div className="rounded-16 relative overflow-hidden shadow-md">
      <div
        className="relative flex h-70 w-full items-center justify-center"
        style={{ background: `linear-gradient(160deg, ${tint}, ${tint}bb)` }}
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.03)_0_8px,transparent_8px_16px)]" />
        <span className="font-serif text-[4rem] text-black/40">{monogram}</span>
      </div>
    </div>

    <div className="rounded-16 border-border bg-card border p-4">
      <Eyebrow className="text-primary">{relation}</Eyebrow>
      <p className="type-h4 mt-1 font-serif leading-snug font-semibold">
        {name}
      </p>
      <p className="type-caption text-muted-foreground mt-1.5">
        Taken at the reception &middot; 14 Jun &middot; 23:41 &middot; iPhone 15
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {["Reception", "Speech", "With audio"].map((t) => (
          <TagPill key={t} label={t} />
        ))}
      </div>
    </div>

    <div className="rounded-16 bg-foreground text-background relative overflow-hidden p-3.5">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(200px 120px at 80% 50%, oklch(0.705 0.120 262.5 / 0.2), transparent 70%)",
        }}
      />
      <div className="relative">
        <Eyebrow className="tracking-[1.5px] opacity-70">Paired audio</Eyebrow>
        <div className="mt-2.5 flex items-center gap-2.5">
          <button
            type="button"
            className="bg-destructive text-primary-foreground flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full border-none shadow-[0_0_0_5px_oklch(0.723_0.135_40/0.15)]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <Waveform bars={wave} height={28} progress={0.38} />
            <p className="type-caption mt-1 font-mono opacity-70">
              00:00 / 2:22
            </p>
          </div>
        </div>
        <p className="type-body-small mt-2.5 font-serif italic opacity-90">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <Button className="rounded-12">Use in book</Button>
      <Button variant="outline" className="rounded-12">
        Favourite
      </Button>
      <Button variant="outline" className="rounded-12">
        Download
      </Button>
      <Button variant="outline" className="rounded-12">
        More
      </Button>
    </div>

    <p className="type-caption text-muted-foreground">
      4032 &times; 3024 &middot; 3.2 MB &middot; Uploaded by Sam O.
    </p>
  </div>
);

const TagPill = ({ label }: { label: string }) => (
  <span className="border-border bg-background type-caption text-muted-foreground inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-semibold">
    {label}
  </span>
);
