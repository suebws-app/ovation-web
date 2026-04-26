import { XIcon } from "@ovation/icons/XIcon";

type PhotoFilterChipProps = {
  label: string;
  active?: boolean;
};

export const PhotoFilterChip = ({
  label,
  active = false,
}: PhotoFilterChipProps) => (
  <span
    className={`type-caption inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold ${active ? "bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground border"}`}
  >
    {label}
    <XIcon width={10} height={10} strokeWidth={1.7} />
  </span>
);
