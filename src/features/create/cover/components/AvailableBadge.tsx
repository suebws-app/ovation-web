import { CheckIcon } from "@ovation/icons/CheckIcon";

type AvailableBadgeProps = {
  label: string;
  tone?: "success" | "warning";
};

export const AvailableBadge = ({
  label,
  tone = "success",
}: AvailableBadgeProps) => (
  <div
    className={
      tone === "warning"
        ? "bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
        : "bg-secondary/30 text-secondary-foreground flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
    }
  >
    <CheckIcon width={12} height={12} strokeWidth={3} />
    {label}
  </div>
);
