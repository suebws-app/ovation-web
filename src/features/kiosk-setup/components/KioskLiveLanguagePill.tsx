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
      "type-body-small inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 font-semibold",
      active ? "border-primary/30 bg-card border shadow-sm" : "bg-card/55",
    )}
  >
    <span className="type-body-small">{flag}</span>
    {label}
  </button>
);
