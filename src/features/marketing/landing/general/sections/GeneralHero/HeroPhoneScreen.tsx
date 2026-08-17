import Image from "next/image";
import { UploadIcon } from "@ovation/icons/UploadIcon";
import { HERO_PHONE_GRID } from "./constants";
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
  <div className="bg-foreground tablet:w-32 desktop:w-38 tablet:p-2 w-27 rounded-[2rem] p-1.5 shadow-lg">
    <div className="bg-background relative overflow-hidden rounded-[1.65rem]">
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
  </div>
);
