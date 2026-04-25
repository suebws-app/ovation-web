import { cn } from "@ovation/ui/utils/cn";

type BookPreviewProps = {
  partner1: string;
  partner2: string;
  date?: string;
  venue?: string;
  coverImage?: React.ReactNode;
  className?: string;
};

export const BookPreview = ({
  partner1,
  partner2,
  date,
  venue,
  coverImage,
  className,
}: BookPreviewProps) => (
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
        Ovation &middot; Volume I
      </p>
      <p className="mt-2 font-serif text-4xl leading-none font-medium tracking-tight break-words italic">
        {partner1 || "Partner 1"}
        <br />
        &amp; {partner2 || "Partner 2"}
      </p>
      {(date || venue) && (
        <p className="type-caption text-muted-foreground mt-1.5 font-mono tracking-wider">
          {date} {date && venue && "—"} {venue}
        </p>
      )}
    </div>
  </div>
);
