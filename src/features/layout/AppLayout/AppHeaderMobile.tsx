import { Logo } from "@ovation/ui/components/Logo";
import { SidebarTrigger } from "@ovation/ui/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export const AppHeaderMobile = () => {
  return (
    <header className="border-border bg-card desktop:hidden flex items-center justify-between border-b px-4 py-3">
      <Logo />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <SidebarTrigger />
      </div>
    </header>
  );
};
