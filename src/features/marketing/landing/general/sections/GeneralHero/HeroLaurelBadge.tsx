import { LaurelIcon } from "@ovation/icons/LaurelIcon";
import { StarIcon } from "@ovation/icons/StarIcon";
import { HERO_STAR_POSITIONS } from "./constants";

type HeroLaurelBadgeProps = {
  label: string;
};

export const HeroLaurelBadge = ({ label }: HeroLaurelBadgeProps) => (
  <div className="text-foreground flex w-fit items-center gap-2">
    <LaurelIcon className="h-11 w-6.5" aria-hidden />
    <div className="flex flex-col items-center gap-1">
      <span className="type-caption font-semibold tracking-wide">{label}</span>
      <span className="text-foreground flex items-center gap-0.5">
        {HERO_STAR_POSITIONS.map((position) => (
          <StarIcon key={position} className="size-3.5 fill-current" />
        ))}
      </span>
    </div>
    <LaurelIcon className="h-11 w-6.5 -scale-x-100" aria-hidden />
  </div>
);
