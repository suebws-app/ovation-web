"use client";

import { Button } from "@ovation/ui/components/Button";
import { Plus } from "@ovation/icons/Plus";
import { Upload } from "@ovation/icons/Upload";
import { LinkIcon } from "@ovation/icons/LinkIcon";
import { ContributionRing } from "./ContributionRing";

export const GuestHero = () => {
  return (
    <div className="relative overflow-hidden rounded-20 bg-card p-8 tablet:p-10 desktop:p-12">
      <div className="absolute -right-15 -top-15 size-80 rounded-full bg-primary/10" />
      <div className="relative grid items-end gap-10 desktop:grid-cols-[1fr_auto]">
        <div>
          <span className="type-overline text-primary">Guests</span>
          <h1 className="mt-2.5 font-serif type-display tracking-tight">
            Your <span className="italic text-primary">112</span> guests,
            all in one place.
          </h1>
          <p className="mt-3.5 max-w-xl type-body text-muted-foreground">
            Track who you&apos;ve invited, who contributed a message, and who
            you owe a thank-you. Import from your invite list or add names by
            hand.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button className="rounded-full shadow-lg">
              <Plus width={14} height={14} />
              Add a guest
            </Button>
            <Button variant="outline" className="rounded-full">
              <Upload width={14} height={14} />
              Import .csv
            </Button>
            <Button variant="outline" className="rounded-full">
              <LinkIcon width={14} height={14} />
              Copy invite link
            </Button>
          </div>
        </div>
        <ContributionRing value={78} total={112} />
      </div>
    </div>
  );
};
