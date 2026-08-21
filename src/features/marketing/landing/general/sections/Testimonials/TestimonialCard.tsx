import Image from "next/image";
import { type ReactNode } from "react";
import { cn } from "@ovation/ui/utils/cn";
import { TestimonialStars } from "./TestimonialStars";

type TestimonialCardProps = {
  quote: ReactNode;
  author: string;
  location: string;
  avatarSrc: string;
  photoSrc: string;
  photoAlt: string;
  photoClassName: string;
};

export const TestimonialCard = ({
  quote,
  author,
  location,
  avatarSrc,
  photoSrc,
  photoAlt,
  photoClassName,
}: TestimonialCardProps) => (
  <div className="bg-warm-panel/40 rounded-16 relative flex flex-col p-6 pb-8">
    <TestimonialStars />

    <blockquote className="landing-body-large text-foreground mt-5">
      &ldquo;{quote}&rdquo;
    </blockquote>

    <div className="mt-auto flex items-center gap-3 pt-8">
      <span className="relative size-10 shrink-0 overflow-hidden rounded-full">
        <Image
          src={avatarSrc}
          alt={author}
          fill
          sizes="40px"
          className="object-cover"
        />
      </span>
      <span className="flex flex-col">
        <span className="text-foreground type-body font-semibold">
          {author}
        </span>
        <span className="text-muted-foreground type-body-small">
          {location}
        </span>
      </span>
    </div>

    <span
      className={cn(
        "rounded-8 border-card absolute right-5 bottom-5 h-16 w-20 overflow-hidden border-4 shadow-lg",
        photoClassName,
      )}
    >
      <Image
        src={photoSrc}
        alt={photoAlt}
        fill
        sizes="80px"
        className="object-cover"
      />
    </span>
  </div>
);
