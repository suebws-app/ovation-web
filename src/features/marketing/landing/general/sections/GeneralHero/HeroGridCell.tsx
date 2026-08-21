import Image from "next/image";

type HeroGridCellProps = {
  src: string;
};

export const HeroGridCell = ({ src }: HeroGridCellProps) => (
  <span className="rounded-8 bg-warm-panel/40 relative block aspect-square overflow-hidden">
    <Image
      src={src}
      alt=""
      fill
      sizes="(min-width: 1220px) 44px, (min-width: 740px) 6vw, 26px"
      className="object-cover"
    />
  </span>
);
