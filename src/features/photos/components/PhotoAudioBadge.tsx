import { Play } from "@ovation/icons/Play";

type PhotoAudioBadgeProps = {
  duration: string;
};

export const PhotoAudioBadge = ({ duration }: PhotoAudioBadgeProps) => (
  <span className="type-caption absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2 py-1 font-semibold text-white">
    <Play width={9} height={9} className="text-white" />
    {duration}
  </span>
);
