import { cn } from "@ovation/ui/utils/cn";

type PolaroidProps = {
  caption: string;
  background: string;
  initial?: string;
  photoUrl?: string | null;
  className?: string;
};

export const Polaroid = ({
  initial,
  caption,
  background,
  photoUrl,
  className,
}: PolaroidProps) => (
  <div
    className={cn(
      "bg-card relative h-full w-full p-2.5 pb-9 shadow-lg",
      className,
    )}
  >
    <div
      className="rounded-4 text-primary-foreground relative flex h-full w-full items-center justify-center overflow-hidden font-semibold tracking-tight"
      style={photoUrl ? undefined : { background }}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={caption}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <span className="type-display">{initial}</span>
      )}
    </div>
    <span className="text-muted-foreground type-caption absolute right-0 bottom-2.5 left-0 text-center font-serif italic">
      {caption}
    </span>
  </div>
);
