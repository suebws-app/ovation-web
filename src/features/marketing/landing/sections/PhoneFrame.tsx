import Image from "next/image";

type PhoneFrameProps = {
  imageSrc: string;
  imageAlt: string;
};

export const PhoneFrame = ({ imageSrc, imageAlt }: PhoneFrameProps) => (
  <div className="bg-foreground mx-auto w-70 rounded-[2.75rem] p-2.5 shadow-lg">
    <div className="bg-warm-panel/40 relative h-140 overflow-hidden rounded-[2.25rem]">
      <span className="bg-foreground absolute top-2.5 left-1/2 z-10 h-4 w-22 -translate-x-1/2 rounded-full" />
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="280px"
        className="object-cover"
      />
    </div>
  </div>
);
