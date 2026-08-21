import { ENJOY_GRID_LEFT, ENJOY_GRID_RIGHT, ENJOY_PILLS } from "./constants";
import { FloatingPill } from "./FloatingPill";
import { PhotoGridColumn } from "./PhotoGridColumn";
import { StepPhone } from "./StepPhone";

type StepVisualEnjoyProps = {
  photoAlt: string;
  pillLabels: string[];
};

export const StepVisualEnjoy = ({
  photoAlt,
  pillLabels,
}: StepVisualEnjoyProps) => (
  <div className="relative w-full max-w-160 pt-6">
    <div className="tablet:pt-8 flex items-center justify-center gap-3">
      <PhotoGridColumn sources={ENJOY_GRID_LEFT} />
      <StepPhone
        imageSrc="/images/general/gen-wedding.webp"
        imageAlt={photoAlt}
        className="tablet:w-46 z-10 w-40 shrink-0"
      />
      <PhotoGridColumn sources={ENJOY_GRID_RIGHT} />
    </div>

    {ENJOY_PILLS.map((pill, index) => (
      <FloatingPill
        key={pill.key}
        label={pillLabels[index] ?? ""}
        className={pill.className}
      />
    ))}
  </div>
);
