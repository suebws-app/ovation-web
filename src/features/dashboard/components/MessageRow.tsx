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
    className="tablet:grid tablet:grid-cols-[56px_1fr_240px_48px] tablet:items-center tablet:gap-5 tablet:px-6 tablet:py-5 flex flex-col gap-3 px-4 py-4"
    style={{ borderTop: index === 0 ? "none" : "1px solid var(--border)" }}
  >
    <div className="tablet:contents flex items-center justify-between gap-3">
      <Avatar
        initials={initials}
        tint={tint}
        size="lg"
        className={index % 2 ? "rotate-2" : "-rotate-2"}
      />
      <div className="min-w-0 flex-1">
        <p className="type-body-large font-serif font-semibold">
          {name}
          <span className="type-body-small text-muted-foreground ml-2.5 font-medium">
            {relation}
          </span>
        </p>
        <p className="type-body-small text-muted-foreground truncate italic">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="bg-primary/10 text-primary hover:bg-primary/20 tablet:size-12 size-10 shrink-0 rounded-full"
      >
        <Play width={16} height={16} />
      </Button>
    </div>
    <Waveform
      bars={wave.slice(0, 32)}
      height={28}
      className="tablet:flex hidden"
    />
  </div>
);
