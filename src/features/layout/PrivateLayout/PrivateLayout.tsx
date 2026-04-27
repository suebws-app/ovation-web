import { SidebarInset, SidebarProvider } from "@ovation/ui/components/Sidebar";
import type { Subscription, User } from "@/lib/api/types";
import { PrivateSideBar } from "./PrivateSidebar";
import { PrivateHeaderDesktop } from "./PrivateHeaderDesktop";
import { PrivateHeaderMobile } from "./PrivateHeaderMobile";

type PrivateLayoutProps = {
  user: User;
  subscription: Subscription | null;
  children: React.ReactNode;
};

export const PrivateLayout = ({
  user,
  subscription,
  children,
}: PrivateLayoutProps) => {
  return (
    <SidebarProvider>
      <PrivateSideBar user={user} />
      <div className="flex w-full flex-1 flex-col overflow-hidden px-6 pb-6">
        <PrivateHeaderDesktop subscription={subscription} />
        <PrivateHeaderMobile />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
};
