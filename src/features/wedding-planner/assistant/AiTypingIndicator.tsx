import { HeartIcon } from "@ovation/icons/HeartIcon";

export const AiTypingIndicator = () => (
  <div className="flex gap-3 self-start">
    <span className="bg-foreground flex size-8 shrink-0 items-center justify-center rounded-full">
      <HeartIcon width={16} height={16} className="text-primary" />
    </span>
    <div className="bg-muted/50 border-border rounded-16 flex items-center gap-1 border px-4 py-3.5">
      <span className="bg-primary/50 size-1.5 animate-pulse rounded-full" />
      <span className="bg-primary/50 size-1.5 animate-pulse rounded-full" />
      <span className="bg-primary/50 size-1.5 animate-pulse rounded-full" />
    </div>
  </div>
);
