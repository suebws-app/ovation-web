import { cn } from "@ovation/ui/utils/cn";
import { StarIcon } from "@ovation/icons/StarIcon";

const STARS = [1, 2, 3, 4, 5];

export const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {STARS.map((star) => (
      <StarIcon
        key={star}
        width={15}
        height={15}
        className={cn(star <= rating ? "text-accent" : "text-border")}
      />
    ))}
  </div>
);
