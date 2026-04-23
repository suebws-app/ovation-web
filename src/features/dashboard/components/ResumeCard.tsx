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
    <div className="flex flex-col gap-4 rounded-20 border border-border bg-card p-5 shadow-sm tablet:flex-row tablet:items-center tablet:gap-6 tablet:p-7">
      <Avatar initials={initials} tint={tint} size="lg" className="-rotate-3" />
      <div className="flex-1">
        <p className="type-body-small text-muted-foreground">
          Pick up where you left off
        </p>
        <p className="mt-1 font-serif type-h3 font-semibold leading-snug">
          {name} &middot; {role}
        </p>
        <p className="mt-1 type-body-small italic text-muted-foreground">
          Paused at {pausedAt} of {duration}
        </p>
      </div>
      <Button
        onClick={onResume}
        size="lg"
        className="w-full rounded-full gap-2.5 shadow-md shadow-primary/40 tablet:w-auto"
      >
        <Play width={16} height={16} />
        Continue listening
      </Button>
    </div>
  );
};
