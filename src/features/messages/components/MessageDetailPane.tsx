"use client";

import { Button } from "@ovation/ui/components/Button";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Download } from "@ovation/icons/Download";
import { Heart } from "@ovation/icons/Heart";
import { Play } from "@ovation/icons/Play";
import { Star } from "@ovation/icons/Star";
import { Waveform } from "@/features/dashboard/components/Waveform";

import type { MessageMock } from "../mocks";

type MessageDetailPaneProps = {
  message: MessageMock;
};

export const MessageDetailPane = ({ message }: MessageDetailPaneProps) => {
  const {
    name,
    relation,
    initials,
    tint,
    quote,
    transcript,
    wave,
    duration,
    favorited,
    listens,
  } = message;

  return (
    <div className="border-border bg-background small-desktop:flex hidden flex-col gap-4 overflow-auto border-l p-5">
      <div className="rounded-16 border-border bg-card flex gap-3.5 border p-5">
        <div
          className="flex size-[72px] shrink-0 -rotate-3 items-center justify-center rounded-full font-serif text-3xl font-bold"
          style={{
            background: tint,
            color: "#5a3b20",
          }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <Eyebrow className="text-primary">{relation}</Eyebrow>
          <p className="type-h4 mt-1 font-serif leading-snug font-semibold">
            {name}
          </p>
          <p className="type-caption text-muted-foreground mt-1">
            Wedding night &middot; 23:41 CET &middot; {duration}
          </p>
        </div>
        <button
          type="button"
          className="text-muted-foreground cursor-pointer self-start bg-transparent p-1"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      <div className="rounded-16 bg-foreground text-background relative overflow-hidden p-4.5">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(200px 120px at 80% 50%, oklch(0.705 0.120 262.5 / 0.2), transparent 70%)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <button
            type="button"
            className="bg-destructive text-primary-foreground flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-none shadow-[0_0_0_6px_oklch(0.723_0.135_40/0.15)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <Waveform bars={wave} height={40} progress={0.42} />
            <div className="type-caption mt-1.5 flex justify-between font-mono opacity-70">
              <span>01:29</span>
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-8 border-l-3 border-l-[oklch(0.65_0.12_65)] bg-[oklch(0.65_0.12_65/0.1)] px-5 py-4">
        <Eyebrow className="text-[#9A6B2F]">Pulled quote</Eyebrow>
        <p className="type-body-large text-foreground mt-2 font-serif leading-relaxed italic">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      <div className="rounded-16 border-border bg-card border p-4.5">
        <div className="mb-2 flex items-center justify-between">
          <Eyebrow className="text-muted-foreground">Transcript</Eyebrow>
          <span className="type-caption text-muted-foreground">
            Auto &middot; 99%
          </span>
        </div>
        <p className="type-body-small text-foreground leading-relaxed">
          {transcript.slice(0, 230)}&hellip;
        </p>
        <button
          type="button"
          className="border-primary/30 type-caption text-primary hover:bg-primary/5 mt-2.5 cursor-pointer rounded-full border bg-transparent px-3 py-1.5 font-semibold transition-colors"
        >
          Open full message &rarr;
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button className="rounded-12">Add to Gold Book</Button>
        <Button variant="outline" className="rounded-12">
          <Download width={14} height={14} /> Download
        </Button>
        <Button variant="outline" className="rounded-12">
          <Heart
            width={14}
            height={14}
            className={favorited ? "fill-destructive text-destructive" : ""}
          />
          {favorited ? "Favourited" : "Favourite"}
        </Button>
        <Button variant="outline" className="rounded-12">
          Reply
        </Button>
      </div>

      <div className="type-caption text-muted-foreground flex items-center gap-2">
        <Play width={10} height={10} />
        <span>Played {listens} times</span>
        <span>&middot;</span>
        <Star
          width={11}
          height={11}
          className="fill-[#9A6B2F] text-[#9A6B2F]"
        />
        <span>Book-worthy</span>
      </div>
    </div>
  );
};
