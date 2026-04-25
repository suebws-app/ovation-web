import { SidebarInset, SidebarProvider } from "@ovation/ui/components/Sidebar";
import { PrivateSideBar } from "./PrivateSidebar";
import { PrivateHeaderDesktop } from "./PrivateHeaderDesktop";
import { PrivateHeaderMobile } from "./PrivateHeaderMobile";

export const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <PrivateSideBar />
      <div className="flex w-full flex-1 flex-col overflow-hidden px-6 pb-6">
        <PrivateHeaderDesktop />
        <PrivateHeaderMobile />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
};
