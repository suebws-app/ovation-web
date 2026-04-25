type PhoneMockupProps = {
  url: string;
  partner1: string;
  partner2: string;
  date?: string;
  venue?: string;
};

export const PhoneMockup = ({
  url,
  partner1,
  partner2,
  date,
  venue,
}: PhoneMockupProps) => (
  <div className="bg-card self-center rounded-[28px] border-[10px] border-black/15 p-3 shadow-lg">
    <div className="rounded-20 bg-background text-foreground flex min-h-[280px] flex-col gap-2.5 p-4">
      <div className="rounded-8 border-border bg-card type-caption text-muted-foreground flex items-center gap-1.5 border px-2.5 py-1.5 font-mono">
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        ovation.love/{url}
      </div>
      <div className="mt-3.5 text-center">
        <p className="type-overline text-muted-foreground tracking-wider">
          Welcome
        </p>
        <p className="mt-1.5 font-serif text-[1.375rem] leading-tight font-semibold">
          {partner1} &amp;{" "}
          <span className="text-primary italic">{partner2}</span>
        </p>
        {(date || venue) && (
          <p className="type-caption text-muted-foreground mt-1">
            {date} {venue && `· ${venue}`}
          </p>
        )}
      </div>
      <div className="rounded-12 bg-primary type-caption text-primary-foreground mt-auto p-2.5 text-center font-semibold">
        Leave a voice message
      </div>
    </div>
  </div>
);
