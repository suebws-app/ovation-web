import { Polaroid } from "./Polaroid";
import { PolaroidPair } from "./PolaroidPair";

type HeroPhotoProps = {
  partnerAName: string;
  partnerBName: string;
  themeColor: string;
  couplePhotoUrl: string | null;
};

const accentBackground = (themeColor: string) =>
  `linear-gradient(160deg, ${themeColor}, color-mix(in oklch, ${themeColor} 65%, black))`;

const counterBackground =
  "linear-gradient(160deg, var(--accent), var(--destructive))";

export const HeroPhoto = ({
  partnerAName,
  partnerBName,
  themeColor,
  couplePhotoUrl,
}: HeroPhotoProps) => {
  if (couplePhotoUrl) {
    return (
      <div className="relative mx-auto aspect-square w-56">
        <div className="absolute inset-0 -translate-x-3.5 translate-y-1.5 -rotate-6">
          <Polaroid
            initial={partnerBName.charAt(0).toUpperCase()}
            caption={partnerBName}
            background={counterBackground}
          />
        </div>
        <div className="absolute inset-0 translate-x-3.5 -translate-y-0.5 rotate-6">
          <Polaroid
            photoUrl={couplePhotoUrl}
            caption={`${partnerAName} & ${partnerBName}`}
            background={accentBackground(themeColor)}
          />
        </div>
      </div>
    );
  }
  return (
    <PolaroidPair
      partnerAName={partnerAName}
      partnerBName={partnerBName}
      themeColor={themeColor}
    />
  );
};
