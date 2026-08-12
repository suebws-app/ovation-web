import { SparkleIcon } from "@ovation/icons/SparkleIcon";

type MarqueeWordProps = {
  label: string;
};

export const MarqueeWord = ({ label }: MarqueeWordProps) => (
  <span className="flex items-center gap-8">
    <span className="type-h3 tablet:type-h2 text-foreground !font-normal">
      {label}
    </span>
    <SparkleIcon className="text-primary size-4 shrink-0" />
  </span>
);
