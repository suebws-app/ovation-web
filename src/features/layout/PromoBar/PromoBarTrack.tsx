import { PromoBarItem } from "./PromoBarItem";

const REPEAT_COUNT = 12;

type PromoBarTrackProps = {
  message: string;
};

export const PromoBarTrack = ({ message }: PromoBarTrackProps) => {
  const items = Array.from({ length: REPEAT_COUNT }, (_, index) => index);

  return (
    <div aria-hidden className="flex shrink-0 items-center gap-12 pr-12">
      {items.map((index) => (
        <PromoBarItem key={index} message={message} />
      ))}
    </div>
  );
};
