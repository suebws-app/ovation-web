"use client";

import { Button } from "@ovation/ui/components/Button";
import { Plus } from "@ovation/icons/Plus";
import { Upload } from "@ovation/icons/Upload";
import { LinkIcon } from "@ovation/icons/LinkIcon";
import { ContributionRing } from "./ContributionRing";

export const GuestHero = () => {
  return (
    <div className="rounded-20 bg-card tablet:p-10 desktop:p-12 relative overflow-hidden p-8">
      <div className="bg-primary/10 absolute -top-15 -right-15 size-80 rounded-full" />
      <div className="desktop:grid-cols-[1fr_auto] relative grid items-end gap-10">
        <div>
          <span className="type-overline text-primary">Guests</span>
          <h1 className="type-display mt-2.5 font-serif tracking-tight">
            Your <span className="text-primary italic">112</span> guests, all in
            one place.
          </h1>
          <p className="type-body text-muted-foreground mt-3.5 max-w-xl">
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
