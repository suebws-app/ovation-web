import Image from "next/image";
import { CameraIcon } from "@ovation/icons/CameraIcon";
import { SHOWCASE_PHONE_THUMBS } from "./constants";
import { ShowcasePhoneThumb } from "./ShowcasePhoneThumb";

type ShowcasePhoneProps = {
  photoAlt: string;
  eventTitle: string;
  uploadLabel: string;
  countLabel: string;
};

export const ShowcasePhone = ({
  photoAlt,
  eventTitle,
  uploadLabel,
  countLabel,
}: ShowcasePhoneProps) => (
  <div className="bg-foreground mx-auto w-70 rounded-[2.75rem] p-2.5 shadow-lg">
    <div className="bg-warm-panel/40 relative h-140 overflow-hidden rounded-[2.25rem]">
      <Image
        src="/images/general/gen-wedding.webp"
        alt={photoAlt}
        fill
        sizes="280px"
        className="object-cover"
      />
      <span
        aria-hidden
        className="from-foreground/10 via-foreground/45 to-foreground/80 absolute inset-0 bg-gradient-to-b"
      />
      <span className="bg-foreground absolute top-2.5 left-1/2 z-10 h-4 w-22 -translate-x-1/2 rounded-full" />

      <div className="absolute inset-x-0 top-22 flex flex-col items-center px-5">
        <span className="ring-background/90 relative size-26 overflow-hidden rounded-full ring-4">
          <Image
            src="/images/hero_hug.webp"
            alt={photoAlt}
            fill
            sizes="120px"
            className="object-cover"
          />
        </span>
        <p className="type-h4 text-background mt-4 text-center font-semibold">
          {eventTitle}
        </p>
        <span className="bg-primary text-primary-foreground type-body-small mt-4 flex items-center gap-2 rounded-full px-4 py-2 font-semibold">
          <CameraIcon className="size-4" aria-hidden />
          {uploadLabel}
        </span>
        <p className="text-background type-caption mt-4 text-center font-medium">
          {countLabel}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 grid grid-cols-3 gap-0.5">
        {SHOWCASE_PHONE_THUMBS.map((src) => (
          <ShowcasePhoneThumb key={src} src={src} alt={photoAlt} />
        ))}
      </div>
    </div>
  </div>
);
