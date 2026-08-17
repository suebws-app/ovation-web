import Image from "next/image";
import { QrCodeIcon } from "@ovation/icons/QrCodeIcon";
import { SLIDESHOW_THUMBS_LEFT, SLIDESHOW_THUMBS_RIGHT } from "./constants";
import { SlideshowThumb } from "./SlideshowThumb";

type StepVisualSlideshowProps = {
  photoAlt: string;
  captionLabel: string;
  qrLabel: string;
};

export const StepVisualSlideshow = ({
  photoAlt,
  captionLabel,
  qrLabel,
}: StepVisualSlideshowProps) => (
  <div className="bg-foreground rounded-16 w-full max-w-140 p-3 shadow-lg">
    <div className="bg-warm-panel/40 relative aspect-16/10 overflow-hidden rounded-lg">
      <Image
        src="/images/general/gen-wedding-party.webp"
        alt={photoAlt}
        fill
        sizes="(min-width: 740px) 40vw, 90vw"
        className="object-cover"
      />
      <span
        aria-hidden
        className="from-foreground/10 to-foreground/60 absolute inset-0 bg-gradient-to-b"
      />

      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {SLIDESHOW_THUMBS_LEFT.map((src) => (
          <SlideshowThumb key={src} src={src} alt={photoAlt} />
        ))}
      </div>

      <div className="absolute top-3 right-3 flex flex-col gap-2">
        {SLIDESHOW_THUMBS_RIGHT.map((src) => (
          <SlideshowThumb key={src} src={src} alt={photoAlt} />
        ))}
      </div>

      <span className="bg-foreground/75 text-background type-caption absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 font-medium backdrop-blur-sm">
        {captionLabel}
      </span>

      <div className="bg-background ring-primary rounded-8 absolute right-3 bottom-3 flex size-16 items-center justify-center ring-2">
        <QrCodeIcon className="text-foreground size-12" aria-label={qrLabel} />
      </div>
    </div>
  </div>
);
