import { StarIcon } from "@ovation/icons/StarIcon";
import { TESTIMONIAL_STARS } from "./constants";

export const TestimonialStars = () => (
  <div className="text-primary flex gap-0.5" aria-hidden>
    {TESTIMONIAL_STARS.map((position) => (
      <StarIcon key={position} className="size-4 fill-current" />
    ))}
  </div>
);
