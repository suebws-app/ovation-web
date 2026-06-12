import { cn } from "@ovation/ui/utils/cn";

const BLOB_STYLES = {
  destructive:
    "radial-gradient(circle, oklch(0.723 0.135 40 / 0.3), transparent 70%)",
  accent:
    "radial-gradient(circle, oklch(0.818 0.105 73.3 / 0.4), transparent 70%)",
};

type AuthSplitLayoutProps = {
  panel: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export const AuthSplitLayout = ({
  panel,
  children,
  className,
}: AuthSplitLayoutProps) => (
  <div
    className={cn(
      "desktop:grid-cols-[40%_1fr] desktop:min-h-[calc(100vh-89px)] desktop:h-auto desktop:overflow-visible grid h-[calc(100svh-89px)] overflow-hidden",
      className,
    )}
  >
    <div className="from-primary to-primary/80 text-primary-foreground desktop:flex desktop:items-center desktop:justify-center relative hidden overflow-hidden bg-linear-to-br">
      <div className="dark:bg-background/90 pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute -top-20 -right-20 rounded-full transition-all duration-700"
        style={{ background: BLOB_STYLES.destructive, width: 320, height: 320 }}
      />
      <div
        className="pointer-events-none absolute -bottom-15 -left-10 rounded-full transition-all duration-700"
        style={{ background: BLOB_STYLES.accent, width: 260, height: 260 }}
      />
      <div className="relative flex w-full max-w-110 flex-col gap-10 p-16">
        {panel}
      </div>
    </div>
    <div className="tablet:px-18 desktop:py-16 desktop:overflow-visible flex h-full min-w-0 items-start justify-center overflow-y-auto px-5 py-3">
      <div className="mx-auto my-auto w-full max-w-130 min-w-0">{children}</div>
    </div>
  </div>
);
