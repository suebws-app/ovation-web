import { cn } from "@ovation/ui/utils/cn";
import { safeHttpUrl } from "@/lib/utils/safe-url";

type DemoWallSlideProps = {
  url: string;
  alt: string;
  isActive: boolean;
  isNew: boolean;
  newLabel: string;
};

export const DemoWallSlide = ({
  url,
  alt,
  isActive,
  isNew,
  newLabel,
}: DemoWallSlideProps) => {
  const safeUrl = safeHttpUrl(url) ?? url;

  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-700",
        isActive ? "opacity-100" : "opacity-0",
      )}
      aria-hidden={!isActive}
    >
      <img src={safeUrl} alt={alt} className="size-full object-cover" />
      {isNew && (
        <span className="bg-primary text-primary-foreground type-caption absolute top-4 left-4 rounded-full px-3 py-1 font-semibold">
          {newLabel}
        </span>
      )}
    </div>
  );
};
