"use client";

import { Avatar } from "@ovation/ui/components/Avatar";
import { Button } from "@ovation/ui/components/Button";
import { Play } from "@ovation/icons/Play";
import { Waveform } from "./Waveform";

type MessageRowProps = {
  name: string;
  relation: string;
  quote: string;
  initials: string;
  tint: string;
  wave: number[];
  index: number;
};

export const MessageRow = ({
  name,
  relation,
  quote,
  initials,
  tint,
  wave,
  index,
}: MessageRowProps) => (
  <div
    className="flex flex-col gap-3 px-4 py-4 tablet:grid tablet:grid-cols-[56px_1fr_240px_48px] tablet:items-center tablet:gap-5 tablet:px-6 tablet:py-5"
    style={{ borderTop: index === 0 ? "none" : "1px solid var(--border)" }}
  >
    <div className="flex items-center gap-3 justify-between tablet:contents">
      <Avatar
        initials={initials}
        tint={tint}
        size="lg"
        className={index % 2 ? "rotate-2" : "-rotate-2"}
      />
      <div className="min-w-0 flex-1">
        <p className="font-serif type-body-large font-semibold">
          {name}
          <span className="ml-2.5 type-body-small font-medium text-muted-foreground">
            {relation}
          </span>
        </p>
        <p className="truncate type-body-small italic text-muted-foreground">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-10 shrink-0 rounded-full bg-primary/10 text-primary hover:bg-primary/20 tablet:size-12"
      >
        <Play width={16} height={16} />
      </Button>
    </div>
    <Waveform
      bars={wave.slice(0, 32)}
      height={28}
      className="hidden tablet:flex"
    />
  </div>
);
