import { cn } from "@ovation/ui/utils/cn";

type TimelineItemProps = {
  label: string;
  time: string;
  count: number;
  active?: boolean;
};

export const TimelineItem = ({
  label,
  time,
  count,
  active = false,
}: TimelineItemProps) => (
  <div
    className={cn(
      "rounded-10 mb-0.5 flex cursor-pointer items-center gap-2.5 px-2.5 py-2 transition-colors",
      active ? "bg-primary/10" : "hover:bg-muted",
    )}
  >
    <div
      className={cn(
        "w-1 self-stretch rounded-full",
        active ? "bg-primary" : "bg-border",
      )}
    />
    <div className="min-w-0 flex-1">
      <p
        className={cn(
          "type-caption truncate",
          active ? "text-foreground font-semibold" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p className="type-caption text-muted-foreground">{time}</p>
    </div>
    <span className="type-caption text-muted-foreground font-semibold">
      {count}
    </span>
  </div>
);
