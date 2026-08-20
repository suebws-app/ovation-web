import { Logo } from "@ovation/ui/components/Logo";
import { SidebarTrigger } from "@ovation/ui/components/Sidebar";
import { CartButton } from "@/components/CartButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const AppHeaderMobile = () => {
  return (
    <header className="border-border bg-card desktop:hidden flex items-center justify-between border-b px-4 py-3">
      <Link href={appRoutes.home}>
        <Logo />
      </Link>
      <div className="flex items-center gap-2">
        <CartButton />
        <ThemeToggle />
        <SidebarTrigger />
      </div>
    </header>
  );
};
