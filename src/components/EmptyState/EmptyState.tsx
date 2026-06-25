import type { ComponentProps, ReactNode } from "react";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";

type EmptyStateCta = {
  label: string;
  href: ComponentProps<typeof Link>["href"];
  icon?: ReactNode;
};

type EmptyStateProps = {
  icon: ReactNode;
  badgeIcon?: ReactNode;
  title: string;
  body: string;
  cta?: EmptyStateCta;
};

export const EmptyState = ({
  icon,
  badgeIcon,
  title,
  body,
  cta,
}: EmptyStateProps) => (
  <div className="tablet:py-20 relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-12 text-center">
    <div className="bg-primary/8 pointer-events-none absolute top-1/2 left-1/2 size-105 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

    <div className="relative">
      <div className="border-primary/15 animate-tap-pulse pointer-events-none absolute -inset-3 rounded-[28px] border" />
      <div className="border-primary/25 pointer-events-none absolute -inset-6 rounded-[36px] border opacity-60" />

      <div className="rounded-20 bg-card border-border relative flex size-40 items-center justify-center border shadow-lg">
        <div className="bg-primary/10 rounded-16 text-primary flex size-24 items-center justify-center">
          {icon}
        </div>
        {badgeIcon && (
          <div className="bg-primary text-primary-foreground absolute -right-3 -bottom-3 flex size-11 items-center justify-center rounded-full shadow-lg">
            {badgeIcon}
          </div>
        )}
      </div>
    </div>

    <div className="tablet:mt-10 mt-8 flex max-w-md flex-col items-center gap-3">
      <h2 className="type-h2 leading-tight tracking-tight">{title}</h2>
      <p className="type-body-small text-muted-foreground leading-relaxed">
        {body}
      </p>
    </div>

    {cta && (
      <div className="tablet:mt-6 mt-5 flex w-full max-w-sm flex-col items-center gap-2">
        <Button asChild className="w-full rounded-full">
          <Link href={cta.href}>
            {cta.icon}
            {cta.label}
          </Link>
        </Button>
      </div>
    )}
  </div>
);
