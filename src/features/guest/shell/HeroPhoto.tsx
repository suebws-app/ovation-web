import { Polaroid } from "./Polaroid";
import { PolaroidPair } from "./PolaroidPair";

type HeroPhotoProps = {
  eventName: string | null;
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
  eventName,
  partnerAName,
  partnerBName,
  themeColor,
  couplePhotoUrl,
}: HeroPhotoProps) => {
  const name = eventName?.trim();

  if (couplePhotoUrl) {
    return (
      <div className="relative mx-auto aspect-square w-56">
        {!name && (
          <div className="absolute inset-0 -translate-x-3.5 translate-y-1.5 -rotate-6">
            <Polaroid
              initial={partnerBName.charAt(0).toUpperCase()}
              caption={partnerBName}
              background={counterBackground}
            />
          </div>
        )}
        <div
          className={
            name
              ? "relative mx-auto"
              : "absolute inset-0 translate-x-3.5 -translate-y-0.5 rotate-6"
          }
        >
          <Polaroid
            photoUrl={couplePhotoUrl}
            caption={name ? name : `${partnerAName} & ${partnerBName}`}
            background={accentBackground(themeColor)}
          />
        </div>
      </div>
    );
  }

  if (name) {
    return (
      <div className="mx-auto aspect-square w-56">
        <Polaroid
          initial={name.charAt(0).toUpperCase()}
          caption={name}
          background={accentBackground(themeColor)}
        />
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
