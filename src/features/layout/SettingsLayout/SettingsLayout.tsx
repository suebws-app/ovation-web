import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@ovation/ui/components/Sidebar";
import { Logo } from "@ovation/ui/components/Logo";
import { SettingsSidebar } from "./SettingsSidebar";
import { getCurrentUser } from "@/lib/auth/session";
type SettingsLayoutProps = {
  children: React.ReactNode;
};

export const SettingsLayout = async ({ children }: SettingsLayoutProps) => {
  const user = await getCurrentUser();
  return (
    <SidebarProvider>
      <SettingsSidebar user={user} />
      <SidebarInset className="min-w-0">
        <header className="border-border bg-card desktop:hidden sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3">
          <Logo />
          <SidebarTrigger />
        </header>
        <div className="tablet:px-10 tablet:py-11 max-w-container mx-auto w-full px-6 py-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
