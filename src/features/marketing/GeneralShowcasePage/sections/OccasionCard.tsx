import type { ComponentType } from "react";
import Image from "next/image";
import { cn } from "@ovation/ui/utils/cn";

type OccasionCardProps = {
  Icon: ComponentType<{ className?: string }>;
  iconWrapClassName: string;
  imageSrc: string;
  title: string;
  body: string;
  wide?: boolean;
};

export const OccasionCard = ({
  Icon,
  iconWrapClassName,
  imageSrc,
  title,
  body,
  wide,
}: OccasionCardProps) => (
  <article
    className={cn(
      "rounded-20 border-border group relative flex min-h-64 flex-col justify-end overflow-hidden border p-6 transition-transform hover:-translate-y-1",
      wide && "desktop:col-span-2",
    )}
  >
    <Image
      src={imageSrc}
      alt={title}
      fill
      sizes="(min-width: 1200px) 25vw, (min-width: 740px) 50vw, 100vw"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div
      aria-hidden
      className="from-foreground via-foreground/55 pointer-events-none absolute inset-0 bg-linear-to-t to-transparent"
    />
    <div className="relative flex flex-col items-start">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "rounded-10 grid size-9 shrink-0 place-items-center",
            iconWrapClassName,
          )}
        >
          <Icon className="size-4.5" />
        </span>
        <h3 className="landing-h3 text-warm-cream line-clamp-2">{title}</h3>
      </div>
      <p className="type-body-small text-warm-cream/85 mt-1.5 line-clamp-2">
        {body}
      </p>
    </div>
  </article>
);
