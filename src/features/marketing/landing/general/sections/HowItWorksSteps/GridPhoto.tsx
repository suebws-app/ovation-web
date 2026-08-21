import Image from "next/image";

type GridPhotoProps = {
  src: string;
  alt: string;
};

export const GridPhoto = ({ src, alt }: GridPhotoProps) => (
  <span className="rounded-8 bg-warm-panel/40 relative block aspect-square overflow-hidden opacity-70">
    <Image src={src} alt={alt} fill sizes="72px" className="object-cover" />
  </span>
);
