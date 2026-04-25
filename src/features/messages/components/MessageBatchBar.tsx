"use client";

import { Button } from "@ovation/ui/components/Button";
import { Check } from "@ovation/icons/Check";

type MessageBatchBarProps = {
  count: number;
  combinedDuration: string;
};

export const MessageBatchBar = ({
  count,
  combinedDuration,
}: MessageBatchBarProps) => {
  if (count === 0) return null;

  return (
    <div className="border-border bg-foreground text-background tablet:px-6 flex items-center gap-3 border-b px-4 py-2.5">
      <div className="rounded-4 bg-secondary flex size-5 items-center justify-center">
        <Check
          width={13}
          height={13}
          className="text-foreground"
          strokeWidth={2.5}
        />
      </div>
      <span className="type-body-small font-semibold">{count} selected</span>
      <span className="type-caption opacity-65">
        &middot; {combinedDuration} combined
      </span>
      <div className="desktop:flex ml-auto hidden gap-1.5">
        {["Favourite", "Download", "Translate", "Tag"].map((t) => (
          <BatchAction key={t} label={t} />
        ))}
        <Button size="sm" className="rounded-full">
          Add to Gold Book
        </Button>
      </div>
    </div>
  );
};

const BatchAction = ({ label }: { label: string }) => (
  <button
    type="button"
    className="type-caption text-background cursor-pointer rounded-full border border-white/25 bg-transparent px-3 py-1.5 font-semibold transition-colors hover:bg-white/10"
  >
    {label}
  </button>
);
