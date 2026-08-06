import type { ReactNode } from "react";
import { cn } from "@ovation/ui/utils/cn";
import { InfoIcon } from "@ovation/icons/InfoIcon";

type StickyCTALayout = "stack" | "split";
type StickyCTATone = "muted" | "warning";

type StickyCTAProps = {
  children: ReactNode;
  caption?: string;
  captionTone?: StickyCTATone;
  layout?: StickyCTALayout;
  className?: string;
};

const captionContent = (caption: string, tone: StickyCTATone) => {
  if (tone === "warning") {
    return (
      <span
        className="bg-warning/15 type-body-small inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-medium"
        style={{ color: "var(--warning)" }}
      >
        <InfoIcon width={24} height={24} />
        {caption}
      </span>
    );
  }
  return <span className="type-caption text-muted-foreground">{caption}</span>;
};

export const StickyCTA = ({
  children,
  caption,
  captionTone = "muted",
  layout = "stack",
  className,
}: StickyCTAProps) => {
  if (layout === "split") {
    return (
      <div
        className={cn(
          "bg-card tablet:px-8 small-desktop:px-10 sticky bottom-0 z-10 px-5 pt-9 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-sm",
          className,
        )}
      >
        <div
          className={cn(
            "tablet:flex-row tablet:items-center flex flex-col gap-3",
            caption ? "tablet:justify-between" : "tablet:justify-end",
          )}
        >
          {caption && (
            <p className="tablet:text-left text-center">
              {captionContent(caption, captionTone)}
            </p>
          )}
          <div className="tablet:w-auto w-full">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-card tablet:px-8 small-desktop:px-10 sticky bottom-0 z-10 px-5 pt-9 pb-[max(1.5rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      {children}
      {caption && (
        <p className="mt-2.5 text-center">
          {captionContent(caption, captionTone)}
        </p>
      )}
    </div>
  );
};
