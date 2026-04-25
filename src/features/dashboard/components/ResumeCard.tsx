"use client";

import { Button } from "@ovation/ui/components/Button";
import { Avatar } from "@ovation/ui/components/Avatar";
import { Play } from "@ovation/icons/Play";

export const ResumeCard = () => {
  const name = "Margot Devreese";
  const role = "Maid of honour";
  const pausedAt = "1:14";
  const duration = "2:22";
  const initials = "M";
  const tint = "#EFC9A8";

  const onResume = () => {};

  return (
    <div className="rounded-20 border-border bg-card tablet:flex-row tablet:items-center tablet:gap-6 tablet:p-7 flex flex-col gap-4 border p-5 shadow-sm">
      <Avatar initials={initials} tint={tint} size="lg" className="-rotate-3" />
      <div className="flex-1">
        <p className="type-body-small text-muted-foreground">
          Pick up where you left off
        </p>
        <p className="type-h3 mt-1 font-serif leading-snug font-semibold">
          {name} &middot; {role}
        </p>
        <p className="type-body-small text-muted-foreground mt-1 italic">
          Paused at {pausedAt} of {duration}
        </p>
      </div>
      <Button
        onClick={onResume}
        size="lg"
        className="shadow-primary/40 tablet:w-auto w-full gap-2.5 rounded-full shadow-md"
      >
        <Play width={16} height={16} />
        Continue listening
      </Button>
    </div>
  );
};
