import Image from "next/image";

type SplitPhotoProps = {
  src: string;
  alt: string;
};

export const SplitPhoto = ({ src, alt }: SplitPhotoProps) => (
  <span className="rounded-4 bg-warm-panel/40 relative block aspect-square overflow-hidden">
    <Image src={src} alt={alt} fill sizes="64px" className="object-cover" />
  </span>
);
