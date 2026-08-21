import { cn } from "@ovation/ui/utils/cn";

type FloatingPillProps = {
  label: string;
  className?: string;
};

export const FloatingPill = ({ label, className }: FloatingPillProps) => (
  <span
    className={cn(
      "border-border bg-card text-foreground type-body-small absolute rounded-full border px-3.5 py-1.5 font-medium shadow-sm",
      className,
    )}
  >
    {label}
  </span>
);
