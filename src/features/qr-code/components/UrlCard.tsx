"use client";

import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { LinkIcon } from "@ovation/icons/LinkIcon";

type UrlCardProps = {
  url?: string;
};

export const UrlCard = ({ url = "lena-and-tomas" }: UrlCardProps) => (
  <div className="rounded-16 border-border bg-card border p-4.5">
    <Eyebrow className="text-muted-foreground mb-2.5">Your short link</Eyebrow>
    <div className="flex items-center gap-2.5">
      <LinkIcon width={16} height={16} className="text-muted-foreground" />
      <span className="type-body-small text-foreground flex-1 font-mono">
        ovation.love/{url}
      </span>
      <button
        type="button"
        className="border-border bg-card type-caption text-foreground hover:bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 font-semibold transition-colors"
      >
        Copy
      </button>
    </div>
    <div className="type-caption text-muted-foreground mt-2.5 flex items-center gap-1.5">
      <span className="bg-secondary size-1.5 rounded-full" />
      Live since Sep 12 &middot;{" "}
      <button
        type="button"
        className="text-primary cursor-pointer font-semibold"
      >
        Change link
      </button>
    </div>
  </div>
);
