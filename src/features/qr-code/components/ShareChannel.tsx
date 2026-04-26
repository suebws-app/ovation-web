import { Circle } from "@ovation/icons/Circle";

type ShareChannelProps = {
  label: string;
  color: string;
};

export const ShareChannel = ({ label, color }: ShareChannelProps) => (
  <button
    type="button"
    className="rounded-12 border-border bg-background hover:bg-muted flex cursor-pointer flex-col items-center gap-1.5 border p-3 transition-colors"
  >
    <span
      className="rounded-10 text-primary-foreground flex size-9 items-center justify-center"
      style={{ background: color }}
    >
      <Circle width={18} height={18} strokeWidth={1.7} />
    </span>
    <span className="type-caption text-foreground font-semibold">{label}</span>
  </button>
);
