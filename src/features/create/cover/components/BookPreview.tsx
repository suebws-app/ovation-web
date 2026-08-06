"use client";

import { cn } from "@ovation/ui/utils/cn";

type BookPreviewProps = {
  /** The event's title line (host names), e.g. "Alex & Jordan" or "Acme Corp". */
  title?: string;
  volumeLabel: string;
  titleFallback: string;
  date?: string;
  venue?: string;
  coverImage?: React.ReactNode;
  className?: string;
};

export const BookPreview = ({
  title,
  volumeLabel,
  titleFallback,
  date,
  venue,
  coverImage,
  className,
}: BookPreviewProps) => {
  return (
    <div
      className={cn(
        "rounded-12 bg-card relative -ml-6 w-[calc(100%+3rem)] -rotate-2 overflow-hidden shadow-lg",
        className,
      )}
    >
      {coverImage && (
        <div className="rounded-t-12 h-55 overflow-hidden">{coverImage}</div>
      )}
      <div className="text-card-foreground p-8">
        <p className="type-overline text-muted-foreground tracking-[2px]">
          {volumeLabel}
        </p>
        <p className="mt-2 font-serif text-4xl leading-none font-medium tracking-tight wrap-break-word italic">
          {title || titleFallback}
        </p>
        {(date || venue) && (
          <p className="type-caption text-muted-foreground mt-1.5 font-mono tracking-wider">
            {date} {date && venue && "—"} {venue}
          </p>
        )}
      </div>
    </div>
  );
};
