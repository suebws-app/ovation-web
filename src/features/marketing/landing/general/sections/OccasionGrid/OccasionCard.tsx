import { type ComponentType, type SVGProps } from "react";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { Link } from "@/i18n/navigation";

type OccasionCardProps = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  title: string;
  subtitle: string;
  linkLabel: string;
};

export const OccasionCard = ({
  Icon,
  href,
  title,
  subtitle,
  linkLabel,
}: OccasionCardProps) => (
  <div className="flex items-start gap-4">
    <span className="bg-primary-soft/40 text-primary rounded-12 flex size-12 shrink-0 items-center justify-center">
      <Icon className="size-6" aria-hidden />
    </span>
    <div className="flex flex-col items-start">
      <h3 className="landing-h4 text-foreground">{title}</h3>
      <p className="text-muted-foreground type-body mt-1">{subtitle}</p>
      <Link
        href={href}
        className="text-primary type-body-small hover:text-primary/80 mt-3 flex items-center gap-1.5 font-semibold transition"
      >
        {linkLabel}
        <ArrowRightIcon className="size-4" aria-hidden />
      </Link>
    </div>
  </div>
);
