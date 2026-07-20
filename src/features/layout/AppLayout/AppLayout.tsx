import { SidebarInset, SidebarProvider } from "@ovation/ui/components/Sidebar";
import type { Event, User } from "@/lib/api/types";
import { UpgradeLimitModal } from "@/features/upgrade/UpgradeLimitModal";
import { ThemeBridge } from "@/features/theme/ThemeBridge";
import { AppSideBar } from "./AppSidebar";
import { AppHeaderDesktop } from "./AppHeaderDesktop";
import { AppHeaderMobile } from "./AppHeaderMobile";
import { SubscriptionAlert } from "./SubscriptionAlert";
import { ProUpgradeAlert } from "./ProUpgradeAlert";
import { AppHeader } from "./AppHeader";

type AppLayoutProps = {
  user: User;
  events: Event[];
  children: React.ReactNode;
  showSubscriptionAlert?: boolean;
  planActivating?: boolean;
};

export const AppLayout = ({
  user,
  events,
  children,
  showSubscriptionAlert = true,
  planActivating = false,
}: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSideBar user={user} events={events} />
      <div className="flex w-full flex-1 flex-col overflow-x-clip">
        <AppHeaderMobile />
        <AppHeader />
        <AppHeaderDesktop isPro={user.accountType === "pro"} />
        <div className="flex min-h-0 flex-1 flex-col">
          {showSubscriptionAlert && user.accountType !== "pro" && (
            <SubscriptionAlert
              planTier={user.planTier}
              storageExpiresAt={user.storageExpiresAt}
              userCreatedAt={user.createdAt}
              storageDays={user.storageDays}
              planActivating={planActivating}
            />
          )}
          {showSubscriptionAlert && user.accountType === "pro" && (
            <ProUpgradeAlert
              planTier={user.planTier}
              planActivating={planActivating}
            />
          )}
          <SidebarInset className="min-h-0 flex-1">{children}</SidebarInset>
        </div>
      </div>
      <UpgradeLimitModal />
      <ThemeBridge initialTheme={user.theme ?? null} />
    </SidebarProvider>
  );
};
