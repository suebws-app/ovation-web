import { Logo } from "@ovation/ui/components/Logo";
import { SidebarTrigger } from "@ovation/ui/components/Sidebar";

export const PrivateHeaderMobile = () => {
  return (
    <header className="border-border bg-card desktop:hidden flex items-center justify-between border-b px-4 py-3">
      <Logo />
      <SidebarTrigger />
    </header>
  );
};
