import { cn } from "@ovation/ui/utils/cn";

export type PillTone = "primary" | "sage" | "gold" | "neutral" | "soft";

const toneClass: Record<PillTone, string> = {
  primary: "bg-primary/15 text-primary",
  sage: "bg-secondary/30 text-secondary-foreground",
  gold: "bg-accent/25 text-accent-foreground",
  neutral: "bg-muted text-muted-foreground",
  soft: "bg-destructive/15 text-destructive",
};

type StatusPillProps = {
  tone: PillTone;
  children: React.ReactNode;
  className?: string;
};

export const StatusPill = ({ tone, children, className }: StatusPillProps) => (
  <span
    className={cn(
      "type-overline inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold whitespace-nowrap",
      toneClass[tone],
      className,
    )}
  >
    {children}
  </span>
);
