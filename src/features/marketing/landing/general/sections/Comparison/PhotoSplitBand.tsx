import { SPLIT_PHOTOS_LEFT, SPLIT_PHOTOS_RIGHT } from "./constants";
import { SplitPhoto } from "./SplitPhoto";

type PhotoSplitBandProps = {
  photoAlt: string;
  moreLabel: string;
  fewerLabel: string;
};

export const PhotoSplitBand = ({
  photoAlt,
  moreLabel,
  fewerLabel,
}: PhotoSplitBandProps) => (
  <div className="relative mx-auto w-full max-w-200">
    <div className="flex items-stretch">
      <div className="grid flex-1 grid-cols-4 gap-1.5">
        {SPLIT_PHOTOS_LEFT.map((src, index) => (
          <SplitPhoto key={`${src}-${index}`} src={src} alt={photoAlt} />
        ))}
      </div>

      <span aria-hidden className="bg-foreground/70 mx-3 w-px shrink-0" />

      <div className="grid flex-1 grid-cols-4 gap-1.5 opacity-60 grayscale">
        {[...SPLIT_PHOTOS_RIGHT, ...SPLIT_PHOTOS_RIGHT].map((src, index) => (
          <SplitPhoto key={`${src}-${index}`} src={src} alt={photoAlt} />
        ))}
      </div>
    </div>

    <span className="border-border bg-card text-foreground type-body-small tablet:left-0 absolute top-1/2 left-2 -translate-y-1/2 rounded-full border px-4 py-2 font-medium shadow-lg">
      {moreLabel}
    </span>
    <span className="border-border bg-card text-muted-foreground type-body-small tablet:right-0 absolute top-1/2 right-2 -translate-y-1/2 rounded-full border px-4 py-2 font-medium shadow-lg">
      {fewerLabel}
    </span>
  </div>
);
