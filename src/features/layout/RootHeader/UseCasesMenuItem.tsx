"use client";

import { type ComponentType, type SVGProps } from "react";
import { DropdownMenuItem } from "@ovation/ui/components/DropdownMenu";
import { Link } from "@/i18n/navigation";

type UseCasesMenuItemProps = {
  href: string;
  label: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const UseCasesMenuItem = ({
  href,
  label,
  description,
  Icon,
}: UseCasesMenuItemProps) => (
  <DropdownMenuItem asChild className="rounded-12 p-3">
    <Link href={href} className="flex w-full items-start gap-3">
      <span className="bg-primary-soft/40 text-primary rounded-8 flex size-9 shrink-0 items-center justify-center">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-foreground type-body font-semibold">{label}</span>
        <span className="text-muted-foreground type-body-small whitespace-normal">
          {description}
        </span>
      </span>
    </Link>
  </DropdownMenuItem>
);
