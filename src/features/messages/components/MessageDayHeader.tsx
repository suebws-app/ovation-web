type MessageDayHeaderProps = {
  day: string;
  date: string;
  count: number;
};

export const MessageDayHeader = ({
  day,
  date,
  count,
}: MessageDayHeaderProps) => (
  <div className="flex items-center gap-2.5 border-b border-border bg-background px-4 py-3 tablet:px-6">
    <span className="font-serif type-body font-semibold">{day}</span>
    <span className="type-caption text-muted-foreground">&middot; {date}</span>
    <span className="ml-auto rounded-full border border-border bg-card px-2 py-0.5 type-caption font-semibold text-muted-foreground">
      {count} {count === 1 ? "message" : "messages"}
    </span>
  </div>
);
