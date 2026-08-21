import { Logo } from "@ovation/ui/components/Logo";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const AuthHeader = () => (
  <header className="tablet:px-8 relative flex items-center px-4 py-4">
    <Link href={appRoutes.home}>
      <Logo />
    </Link>
  </header>
);
