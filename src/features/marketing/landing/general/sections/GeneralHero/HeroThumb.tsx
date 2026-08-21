import Image from "next/image";

type HeroThumbProps = {
  src: string;
};

export const HeroThumb = ({ src }: HeroThumbProps) => (
  <span className="rounded-8 relative block h-11 w-14 overflow-hidden">
    <Image
      src={src}
      alt=""
      fill
      sizes="(min-width: 1024px) 56px, 44px"
      className="object-cover"
    />
  </span>
);
