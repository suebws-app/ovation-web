import { Polaroid } from "./Polaroid";
import { PolaroidPair } from "./PolaroidPair";

type HeroPhotoProps = {
  hostAName: string;
  hostBName: string | null;
  themeColor: string;
  photoUrl: string | null;
};

const accentBackground = (themeColor: string) =>
  `linear-gradient(160deg, ${themeColor}, color-mix(in oklch, ${themeColor} 65%, black))`;

const counterBackground =
  "linear-gradient(160deg, var(--accent), var(--destructive))";

export const HeroPhoto = ({
  hostAName,
  hostBName,
  themeColor,
  photoUrl,
}: HeroPhotoProps) => {
  if (photoUrl) {
    const caption = hostBName ? `${hostAName} & ${hostBName}` : hostAName;
    return (
      <div className="relative mx-auto aspect-square w-56">
        {hostBName && (
          <div className="absolute inset-0 -translate-x-3.5 translate-y-1.5 -rotate-6">
            <Polaroid
              initial={hostBName.charAt(0).toUpperCase()}
              caption={hostBName}
              background={counterBackground}
            />
          </div>
        )}
        <div
          className={
            hostBName
              ? "absolute inset-0 translate-x-3.5 -translate-y-0.5 rotate-6"
              : "absolute inset-0"
          }
        >
          <Polaroid
            photoUrl={photoUrl}
            caption={caption}
            background={accentBackground(themeColor)}
          />
        </div>
      </div>
    );
  }
  return (
    <PolaroidPair
      hostAName={hostAName}
      hostBName={hostBName}
      themeColor={themeColor}
    />
  );
};
