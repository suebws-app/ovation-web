"use client";

import { Button } from "@ovation/ui/components/Button";

export const NudgeCard = () => {
  const icon = "✦";
  const title = "Your Gold Book is 80% ready";
  const description = "8 more quotes to approve before it goes to press.";
  const actionLabel = "Open editor";

  const onAction = () => {};

  return (
    <div className="flex flex-col gap-4 rounded-16 border border-accent/50 bg-accent/15 p-5 tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-12 bg-accent font-serif text-[1.375rem] font-bold text-primary-foreground">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-serif type-body-large font-semibold">{title}</p>
        <p className="type-body-small text-muted-foreground">{description}</p>
      </div>
      <Button
        variant="outline"
        onClick={onAction}
        className="w-full rounded-full tablet:w-auto bg-transparent"
      >
        {actionLabel}
      </Button>
    </div>
  );
};
