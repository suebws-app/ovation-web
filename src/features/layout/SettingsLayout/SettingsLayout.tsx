import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@ovation/ui/components/Sidebar";
import { Logo } from "@ovation/ui/components/Logo";
import { SettingsSidebar } from "./SettingsSidebar";
import { getCurrentUser } from "@/lib/auth/session";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
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
          <Link href={appRoutes.home}>
            <Logo />
          </Link>
          <SidebarTrigger />
        </header>
        <div className="tablet:p-6 max-w-container mx-auto flex w-full flex-1 flex-col px-2 py-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
