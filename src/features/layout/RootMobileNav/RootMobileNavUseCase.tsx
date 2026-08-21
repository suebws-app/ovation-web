"use client";

import { type ComponentType, type SVGProps } from "react";
import { SheetClose } from "@ovation/ui/components/Sheet";
import { Link } from "@/i18n/navigation";

type RootMobileNavUseCaseProps = {
  href: string;
  label: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const RootMobileNavUseCase = ({
  href,
  label,
  description,
  Icon,
}: RootMobileNavUseCaseProps) => (
  <SheetClose asChild>
    <Link
      href={href}
      className="rounded-12 hover:bg-muted flex items-start gap-3 px-3 py-3 transition"
    >
      <span className="bg-primary-soft/40 text-primary rounded-8 flex size-9 shrink-0 items-center justify-center">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-foreground type-body font-semibold">{label}</span>
        <span className="text-muted-foreground type-body-small whitespace-normal">
          {description}
        </span>
      </span>
    </Link>
  </SheetClose>
);
