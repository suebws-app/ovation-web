import Image from "next/image";

type SplitPhotoProps = {
  src: string;
  alt: string;
};

export const SplitPhoto = ({ src, alt }: SplitPhotoProps) => (
  <span className="rounded-4 bg-warm-panel/40 tablet:w-20 relative block aspect-square w-14 shrink-0 overflow-hidden">
    <Image src={src} alt={alt} fill sizes="80px" className="object-cover" />
  </span>
);
