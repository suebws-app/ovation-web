import Image from "next/image";
import { cn } from "@ovation/ui/utils/cn";

type AlbumCardProps = {
  caption: string;
  imageSrc: string;
  spanClassName: string;
};

export const AlbumCard = ({
  caption,
  imageSrc,
  spanClassName,
}: AlbumCardProps) => (
  <div
    className={cn(
      "rounded-16 border-border relative overflow-hidden border",
      spanClassName,
    )}
  >
    <Image
      src={imageSrc}
      alt={caption}
      fill
      sizes="(min-width: 740px) 50vw, 100vw"
      className="object-cover"
    />
    <span className="bg-card/90 type-caption text-foreground absolute bottom-3 left-3 rounded-full px-3 py-1.5 font-semibold backdrop-blur">
      {caption}
    </span>
  </div>
);
