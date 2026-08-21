import Image from "next/image";

type HeroThumbProps = {
  src: string;
  alt: string;
};

export const HeroThumb = ({ src, alt }: HeroThumbProps) => (
  <span className="rounded-8 relative block h-11 w-14 overflow-hidden">
    <Image src={src} alt={alt} fill sizes="56px" className="object-cover" />
  </span>
);
