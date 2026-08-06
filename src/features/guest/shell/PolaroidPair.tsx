import { Polaroid } from "./Polaroid";

type PolaroidPairProps = {
  hostAName: string;
  hostBName: string | null;
  themeColor: string;
};

const accentBackground = (themeColor: string) =>
  `linear-gradient(160deg, ${themeColor}, color-mix(in oklch, ${themeColor} 65%, black))`;

const counterBackground =
  "linear-gradient(160deg, var(--accent), var(--destructive))";

export const PolaroidPair = ({
  hostAName,
  hostBName,
  themeColor,
}: PolaroidPairProps) => {
  if (!hostBName) {
    return (
      <div className="relative mx-auto aspect-square w-56">
        <Polaroid
          initial={hostAName.charAt(0).toUpperCase()}
          caption={hostAName}
          background={accentBackground(themeColor)}
        />
      </div>
    );
  }
  return (
    <div className="relative mx-auto aspect-square w-56">
      <div className="absolute inset-0 -translate-x-3.5 translate-y-1.5 -rotate-6">
        <Polaroid
          initial={hostBName.charAt(0).toUpperCase()}
          caption={hostBName}
          background={accentBackground(themeColor)}
        />
      </div>
      <div className="absolute inset-0 translate-x-3.5 -translate-y-0.5 rotate-6">
        <Polaroid
          initial={hostAName.charAt(0).toUpperCase()}
          caption={hostAName}
          background={counterBackground}
        />
      </div>
    </div>
  );
};
