import { Link } from "@/i18n/navigation";

type AuthFooterLinkProps = {
  prompt?: string;
  href: string;
  linkLabel: string;
};

export const AuthFooterLink = ({
  prompt,
  href,
  linkLabel,
}: AuthFooterLinkProps) => (
  <p className="type-body-small text-muted-foreground tablet:mt-4.5 mt-3 flex items-center justify-center gap-4 text-center">
    {prompt}
    <Link href={href} className="text-foreground font-semibold">
      {linkLabel}
    </Link>
  </p>
);
