type PhoneMockupProps = {
  url: string
  partner1: string
  partner2: string
  date?: string
  venue?: string
}

export const PhoneMockup = ({ url, partner1, partner2, date, venue }: PhoneMockupProps) => (
  <div className="self-center rounded-[28px] border-[10px] border-black/15 bg-card p-3 shadow-lg">
    <div className="flex min-h-[280px] flex-col gap-2.5 rounded-20 bg-background p-4 text-foreground">
      <div className="flex items-center gap-1.5 rounded-8 border border-border bg-card px-2.5 py-1.5 font-mono type-caption text-muted-foreground">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        ovation.love/{url}
      </div>
      <div className="mt-3.5 text-center">
        <p className="type-overline tracking-wider text-muted-foreground">Welcome</p>
        <p className="mt-1.5 font-serif text-[1.375rem] font-semibold leading-tight">
          {partner1} &amp;{' '}
          <span className="italic text-primary">{partner2}</span>
        </p>
        {(date || venue) && (
          <p className="mt-1 type-caption text-muted-foreground">
            {date} {venue && `· ${venue}`}
          </p>
        )}
      </div>
      <div className="mt-auto rounded-12 bg-primary p-2.5 text-center type-caption font-semibold text-primary-foreground">
        Leave a voice message
      </div>
    </div>
  </div>
)
