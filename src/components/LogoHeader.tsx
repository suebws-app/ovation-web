import { Logo } from "@ovation/ui/components/Logo";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const LogoHeader = () => {
  return (
    <header className="tablet:px-8 flex w-full items-center px-4 py-4">
      <Link href={appRoutes.home}>
        <Logo />
      </Link>
    </header>
  );
};
