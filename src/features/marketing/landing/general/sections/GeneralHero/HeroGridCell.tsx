import Image from "next/image";

type HeroGridCellProps = {
  src: string;
  alt: string;
};

export const HeroGridCell = ({ src, alt }: HeroGridCellProps) => (
  <span className="rounded-8 bg-warm-panel/40 relative block aspect-square overflow-hidden">
    <Image src={src} alt={alt} fill sizes="72px" className="object-cover" />
  </span>
);
