import { cn } from "@ovation/ui/utils/cn";

type GuestPageButtonProps = {
  label: string;
  active: boolean;
};

export const GuestPageButton = ({ label, active }: GuestPageButtonProps) => (
  <button
    type="button"
    className={cn(
      "rounded-8 type-caption flex size-7.5 cursor-pointer items-center justify-center font-semibold",
      active
        ? "bg-foreground text-background"
        : "border-border bg-card text-foreground border",
    )}
  >
    {label}
  </button>
);
