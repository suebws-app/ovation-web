import { cn } from "@ovation/ui/utils/cn";

type KioskLiveLanguagePillProps = {
  flag: string;
  label: string;
  active?: boolean;
};

export const KioskLiveLanguagePill = ({
  flag,
  label,
  active,
}: KioskLiveLanguagePillProps) => (
  <button
    type="button"
    className={cn(
      "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 type-body-small font-semibold",
      active
        ? "border border-primary/30 bg-card shadow-sm"
        : "bg-card/55",
    )}
  >
    <span className="type-body-small">{flag}</span>
    {label}
  </button>
);
