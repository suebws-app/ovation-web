import Image from "next/image";

type SlideshowThumbProps = {
  src: string;
  alt: string;
};

export const SlideshowThumb = ({ src, alt }: SlideshowThumbProps) => (
  <span className="rounded-8 relative block h-10 w-13 overflow-hidden">
    <Image src={src} alt={alt} fill sizes="52px" className="object-cover" />
  </span>
);
