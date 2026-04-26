import { cn } from "@ovation/ui/utils/cn";
import { Download } from "@ovation/icons/Download";

type FormatRowProps = {
  ext: string;
  desc: string;
  size: string;
  primary: boolean;
};

export const FormatRow = ({ ext, desc, size, primary }: FormatRowProps) => (
  <div className="rounded-12 border-border bg-background flex items-center gap-3 border p-3">
    <div
      className={cn(
        "rounded-8 type-caption flex size-10 items-center justify-center font-bold tracking-wider",
        primary
          ? "bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground border",
      )}
    >
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
      className={cn(
        "flex size-8.5 cursor-pointer items-center justify-center rounded-full transition-colors",
        primary
          ? "bg-primary text-primary-foreground shadow-primary/35 shadow-md"
          : "border-border bg-card text-foreground hover:bg-muted border",
      )}
    >
      <Download width={15} height={15} strokeWidth={1.7} />
    </button>
  </div>
);
