import Image from "next/image";
import { UploadIcon } from "@ovation/icons/UploadIcon";
import { HERO_PHONE_GRID, HERO_PHONE_SCREEN_INSET } from "./constants";
import { HeroGridCell } from "./HeroGridCell";

type HeroPhoneScreenProps = {
  photoAlt: string;
  newLabel: string;
  uploadLabel: string;
};

export const HeroPhoneScreen = ({
  photoAlt,
  newLabel,
  uploadLabel,
}: HeroPhoneScreenProps) => (
  <div className="relative w-full">
    <div
      className="bg-background rounded-12 absolute overflow-hidden"
      style={HERO_PHONE_SCREEN_INSET}
    >
      <div className="tablet:gap-1.5 tablet:px-3 tablet:pt-5 tablet:pb-2.5 relative flex flex-col items-center gap-1.5 px-2 pt-4 pb-2">
        <span className="ring-primary tablet:size-12 relative size-10 overflow-hidden rounded-full ring-2">
          <Image
            src="/images/hero_hug.webp"
            alt={photoAlt}
            fill
            sizes="(min-width: 740px) 64px, 40px"
            className="object-cover"
          />
        </span>
        <span className="text-foreground type-caption font-semibold">
          {newLabel}
        </span>
        <span className="bg-primary text-primary-foreground type-caption flex items-center gap-1 rounded-full px-2.5 py-1 font-medium whitespace-nowrap">
          <UploadIcon className="size-3" aria-hidden />
          {uploadLabel}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-0.5 px-1 pb-1">
        {HERO_PHONE_GRID.map((src) => (
          <HeroGridCell key={src} src={src} alt={photoAlt} />
        ))}
      </div>
    </div>

    <Image
      src="/images/iphone-11-mockup.webp"
      alt=""
      width={900}
      height={1752}
      sizes="(min-width: 1220px) 160px, (min-width: 740px) 25vw, 108px"
      priority
      className="pointer-events-none relative w-full select-none"
    />
  </div>
);
