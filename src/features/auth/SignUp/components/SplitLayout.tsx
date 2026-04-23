import { cn } from "@ovation/ui/utils/cn";

type SplitLayoutProps = {
  left: React.ReactNode;
  right: React.ReactNode;
  blobScale?: number;
  className?: string;
};

export const SplitLayout = ({
  left,
  right,
  blobScale = 1,
  className,
}: SplitLayoutProps) => {
  const topSize = Math.round(320 * blobScale);
  const bottomSize = Math.round(260 * blobScale);

  return (
    <div
      className={cn(
        "grid min-h-[calc(100vh-89px)] desktop:grid-cols-[40%_1fr]",
        className,
      )}
    >
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground desktop:flex desktop:items-center desktop:justify-center">
        <DecorativeBlob
          className="-top-20 -right-20"
          color="destructive"
          size={topSize}
        />
        <DecorativeBlob
          className="-bottom-15 -left-10"
          color="accent"
          size={bottomSize}
        />
        <div className="relative flex w-full max-w-[440px] flex-col gap-10 p-16">
          {left}
        </div>
      </div>
      <div className="flex items-center px-6 py-16 tablet:px-18">
        <div className="w-full max-w-[520px]">{right}</div>
      </div>
    </div>
  );
};

const DecorativeBlob = ({
  className,
  color,
  size,
}: {
  className?: string;
  color: string;
  size: number;
}) => {
  const styleMap: Record<string, string> = {
    destructive:
      "radial-gradient(circle, oklch(0.723 0.135 40 / 0.3), transparent 70%)",
    accent:
      "radial-gradient(circle, oklch(0.818 0.105 73.3 / 0.4), transparent 70%)",
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute rounded-full transition-all duration-700",
        className,
      )}
      style={{
        background: styleMap[color],
        width: size,
        height: size,
      }}
    />
  );
};
