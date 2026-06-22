import { cn } from "@ovation/ui/utils/cn";
import { DownloadIcon } from "@ovation/icons/DownloadIcon";

type FormatRowProps = {
  ext: string;
  desc: string;
  size: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const FormatRow = ({
  ext,
  desc,
  size,
  onClick,
  disabled,
}: FormatRowProps) => (
  <div
    className={cn(
      "rounded-12 border-border bg-background flex items-center gap-3 border p-3",
      disabled && !onClick && "opacity-60",
    )}
  >
    <div className="rounded-8 type-caption flex size-10 items-center justify-center font-bold tracking-wider">
      {ext}
    </div>
    <div className="min-w-0 flex-1">
      <p className="type-body-small font-semibold">{ext}</p>
      <p className="type-caption text-muted-foreground">
        {desc} &middot; {size}
      </p>
    </div>
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground flex size-8.5 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        !disabled && "cursor-pointer",
      )}
    >
      <DownloadIcon width={15} height={15} strokeWidth={1.7} />
    </button>
  </div>
);
