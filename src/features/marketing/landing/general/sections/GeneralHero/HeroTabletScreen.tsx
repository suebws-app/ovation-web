import Image from "next/image";
import { QrCodeIcon } from "@ovation/icons/QrCodeIcon";
import { HERO_THUMBS } from "./constants";
import { HeroThumb } from "./HeroThumb";

type HeroTabletScreenProps = {
  photoAlt: string;
  captionLabel: string;
  qrLabel: string;
};

export const HeroTabletScreen = ({
  photoAlt,
  captionLabel,
  qrLabel,
}: HeroTabletScreenProps) => (
  <div className="bg-foreground rounded-16 tablet:p-3 relative w-full p-2 shadow-lg">
    <div className="rounded-12 bg-warm-panel/40 relative aspect-16/10 overflow-hidden">
      <Image
        src="/images/general/gen-wedding-party.webp"
        alt={photoAlt}
        fill
        sizes="(min-width: 1220px) 540px, (min-width: 1024px) 42vw, (min-width: 640px) 88vw, 92vw"
        priority
        fetchPriority="high"
        quality={70}
        className="object-cover"
      />

      <div className="absolute top-3 right-3 flex flex-col gap-2">
        {HERO_THUMBS.map((src) => (
          <HeroThumb key={src} src={src} />
        ))}
      </div>

      <span className="bg-foreground/70 text-background type-caption absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 font-medium backdrop-blur-sm">
        {captionLabel}
      </span>

      <div className="bg-background ring-primary rounded-12 absolute right-3 bottom-3 flex size-18 items-center justify-center ring-2">
        <QrCodeIcon className="text-foreground size-14" aria-label={qrLabel} />
      </div>
    </div>
  </div>
);
