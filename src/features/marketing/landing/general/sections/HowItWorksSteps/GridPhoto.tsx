import Image from "next/image";

type GridPhotoProps = {
  src: string;
};

export const GridPhoto = ({ src }: GridPhotoProps) => (
  <span className="rounded-8 bg-warm-panel/40 relative block aspect-square overflow-hidden opacity-70">
    <Image
      src={src}
      alt=""
      fill
      sizes="(min-width: 1024px) 48px, 64px"
      className="object-cover"
    />
  </span>
);
