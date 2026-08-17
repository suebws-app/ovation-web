import { type ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type RootNavLinkProps = {
  href: string;
  children: ReactNode;
};

export const RootNavLink = ({ href, children }: RootNavLinkProps) => (
  <Link
    href={href}
    className="text-foreground type-body hover:text-primary font-medium transition"
  >
    {children}
  </Link>
);
