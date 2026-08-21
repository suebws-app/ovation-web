import Image from "next/image";

type ShowcasePhoneThumbProps = {
  src: string;
  alt: string;
};

export const ShowcasePhoneThumb = ({ src, alt }: ShowcasePhoneThumbProps) => (
  <span className="relative block aspect-square overflow-hidden">
    <Image src={src} alt={alt} fill sizes="90px" className="object-cover" />
  </span>
);
