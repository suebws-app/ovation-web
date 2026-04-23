import { Logo } from "@ovation/ui/components/Logo";
import { SidebarTrigger } from "@ovation/ui/components/Sidebar";

export const PrivateHeaderMobile = () => {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 desktop:hidden">
      <Logo />
      <SidebarTrigger />
    </header>
  );
};
