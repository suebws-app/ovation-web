import { cn } from "@ovation/ui/utils/cn";
import { safeHttpUrl } from "@/lib/utils/safe-url";

type DemoPhoneThumbProps = {
  url: string;
  alt: string;
  isNew: boolean;
};

export const DemoPhoneThumb = ({ url, alt, isNew }: DemoPhoneThumbProps) => (
  <span
    className={cn(
      "rounded-8 relative block aspect-square overflow-hidden",
      isNew && "ring-primary ring-2",
    )}
  >
    <img
      src={safeHttpUrl(url) ?? url}
      alt={alt}
      className="size-full object-cover"
    />
  </span>
);
