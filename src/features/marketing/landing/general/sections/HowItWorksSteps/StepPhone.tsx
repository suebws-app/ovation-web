import Image from "next/image";
import { type ReactNode } from "react";
import { cn } from "@ovation/ui/utils/cn";

type StepPhoneProps = {
  imageSrc: string;
  imageAlt: string;
  className?: string;
  children?: ReactNode;
};

export const StepPhone = ({
  imageSrc,
  imageAlt,
  className,
  children,
}: StepPhoneProps) => (
  <div className={cn("bg-foreground rounded-[2rem] p-2 shadow-lg", className)}>
    <div className="bg-warm-panel/40 relative aspect-9/19 overflow-hidden rounded-[1.6rem]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="200px"
        className="object-cover object-top"
      />
      <span className="bg-foreground absolute top-2 left-1/2 z-10 h-3 w-14 -translate-x-1/2 rounded-full" />
      {children}
    </div>
  </div>
);
