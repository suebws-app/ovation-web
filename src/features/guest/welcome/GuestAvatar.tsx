import { cn } from "@ovation/ui/utils/cn";
import { safeHttpUrl } from "@/lib/utils/safe-url";

type GuestAvatarProps = {
  url: string | null;
  initials: string;
  alt: string;
  className?: string;
};

export const GuestAvatar = ({
  url,
  initials,
  alt,
  className,
}: GuestAvatarProps) => {
  const safeUrl = safeHttpUrl(url);

  return (
    <span
      className={cn(
        "ring-background/90 bg-warm-panel relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full ring-3",
        className,
      )}
    >
      {safeUrl ? (
        <img src={safeUrl} alt={alt} className="size-full object-cover" />
      ) : (
        <span className="type-body text-foreground font-semibold">
          {initials}
        </span>
      )}
    </span>
  );
};
