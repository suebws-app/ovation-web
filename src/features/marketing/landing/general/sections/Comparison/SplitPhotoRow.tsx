import { SplitPhoto } from "./SplitPhoto";

type SplitPhotoRowProps = {
  photos: string[];
  alt: string;
  durationSeconds: number;
};

export const SplitPhotoRow = ({
  photos,
  alt,
  durationSeconds,
}: SplitPhotoRowProps) => (
  <div className="ov-marquee-mask overflow-hidden">
    <div
      aria-hidden
      className="ov-marquee-track tablet:gap-1.5 flex gap-1"
      style={{ animationDuration: `${durationSeconds}s` }}
    >
      {[...photos, ...photos].map((src, index) => (
        <SplitPhoto key={`${src}-${index}`} src={src} alt={alt} />
      ))}
    </div>
  </div>
);
