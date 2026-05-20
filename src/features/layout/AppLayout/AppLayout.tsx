import { SidebarInset, SidebarProvider } from "@ovation/ui/components/Sidebar";
import type { Event, User } from "@/lib/api/types";
import { AppSideBar } from "./AppSidebar";
import { AppHeaderDesktop } from "./AppHeaderDesktop";
import { AppHeaderMobile } from "./AppHeaderMobile";
import { SubscriptionAlert } from "./SubscriptionAlert";

type AppLayoutProps = {
  user: User;
  events: Event[];
  children: React.ReactNode;
};

export const AppLayout = ({ user, events, children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSideBar user={user} events={events} />
      <div className="flex w-full flex-1 flex-col overflow-hidden pb-6">
        <AppHeaderDesktop planTier={user.planTier} />
        <AppHeaderMobile />
        <SubscriptionAlert
          planTier={user.planTier}
          storageExpiresAt={user.storageExpiresAt}
          userCreatedAt={user.createdAt}
        />
        <SidebarInset className="min-h-0 flex-1 overflow-hidden">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
