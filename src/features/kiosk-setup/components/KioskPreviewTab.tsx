import { cn } from "@ovation/ui/utils/cn";

type KioskPreviewTabProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export const KioskPreviewTab = ({
  label,
  active,
  onClick,
}: KioskPreviewTabProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "cursor-pointer rounded-8 px-3 py-1.5 type-caption font-semibold",
      active
        ? "border border-border bg-background text-foreground"
        : "border border-transparent text-muted-foreground",
    )}
  >
    {label}
  </button>
);
