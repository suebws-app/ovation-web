"use client";

import { Button } from "@ovation/ui/components/Button";

export const NudgeCard = () => {
  const icon = "✦";
  const title = "Your Gold Book is 80% ready";
  const description = "8 more quotes to approve before it goes to press.";
  const actionLabel = "Open editor";

  const onAction = () => {};

  return (
    <div className="rounded-16 border-accent/50 bg-accent/15 tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6 flex flex-col gap-4 border p-5">
      <div className="rounded-12 bg-accent text-primary-foreground flex size-12 shrink-0 items-center justify-center font-serif text-[1.375rem] font-bold">
        {icon}
      </div>
      <div className="flex-1">
        <p className="type-body-large font-serif font-semibold">{title}</p>
        <p className="type-body-small text-muted-foreground">{description}</p>
      </div>
      <Button
        variant="outline"
        onClick={onAction}
        className="tablet:w-auto w-full rounded-full bg-transparent"
      >
        {actionLabel}
      </Button>
    </div>
  );
};
