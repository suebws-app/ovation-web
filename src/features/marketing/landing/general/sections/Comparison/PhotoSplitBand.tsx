import {
  buildMarqueeRows,
  SPLIT_PHOTOS_LEFT,
  SPLIT_PHOTOS_RIGHT,
} from "./constants";
import { SplitPhotoRow } from "./SplitPhotoRow";

type PhotoSplitBandProps = {
  photoAlt: string;
  moreLabel: string;
  fewerLabel: string;
};

const LEFT_ROWS = buildMarqueeRows(SPLIT_PHOTOS_LEFT);
const RIGHT_ROWS = buildMarqueeRows(SPLIT_PHOTOS_RIGHT);
const ROW_DURATIONS = [8, 10, 9];

export const PhotoSplitBand = ({
  photoAlt,
  moreLabel,
  fewerLabel,
}: PhotoSplitBandProps) => (
  <div className="relative mx-auto w-full max-w-200">
    <div className="flex items-stretch">
      <div className="tablet:gap-1.5 flex min-w-0 flex-1 flex-col gap-1">
        {LEFT_ROWS.map((photos, index) => (
          <SplitPhotoRow
            key={index}
            photos={photos}
            alt={photoAlt}
            durationSeconds={ROW_DURATIONS[index]!}
          />
        ))}
      </div>

      <span aria-hidden className="bg-foreground/70 mx-3 w-px shrink-0" />

      <div className="tablet:gap-1.5 flex min-w-0 flex-1 flex-col gap-1 opacity-60 grayscale">
        {RIGHT_ROWS.map((photos, index) => (
          <SplitPhotoRow
            key={index}
            photos={photos}
            alt={photoAlt}
            durationSeconds={ROW_DURATIONS[index]! + 2}
          />
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
