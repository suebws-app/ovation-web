import { SidebarInset, SidebarProvider } from "@ovation/ui/components/Sidebar";
import type { Event, User } from "@/lib/api/types";
import { UpgradeLimitModal } from "@/features/upgrade/UpgradeLimitModal";
import { AppSideBar } from "./AppSidebar";
import { AppHeaderDesktop } from "./AppHeaderDesktop";
import { AppHeaderMobile } from "./AppHeaderMobile";
import { SubscriptionAlert } from "./SubscriptionAlert";

type AppLayoutProps = {
  user: User;
  events: Event[];
  children: React.ReactNode;
  showSubscriptionAlert?: boolean;
};

export const AppLayout = ({
  user,
  events,
  children,
  showSubscriptionAlert = true,
}: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSideBar user={user} events={events} />
      <div className="flex w-full flex-1 flex-col overflow-hidden">
        <AppHeaderDesktop />
        <AppHeaderMobile />
        <div className="min-h-0 flex-1 overflow-y-auto pb-6">
          {showSubscriptionAlert && user.accountType !== "pro" && (
            <SubscriptionAlert
              planTier={user.planTier}
              storageExpiresAt={user.storageExpiresAt}
              userCreatedAt={user.createdAt}
              storageDays={user.storageDays}
            />
          )}
          <SidebarInset className="min-h-0 flex-1">{children}</SidebarInset>
        </div>
      </div>
      <UpgradeLimitModal />
    </SidebarProvider>
  );
};
