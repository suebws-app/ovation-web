import { SidebarInset, SidebarProvider } from "@ovation/ui/components/Sidebar";
import { PrivateSideBar } from "./PrivateSidebar";
import { PrivateHeaderDesktop } from "./PrivateHeaderDesktop";
import { PrivateHeaderMobile } from "./PrivateHeaderMobile";

export const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <PrivateSideBar />
      <div className="flex w-full flex-1 px-6 pb-6 flex-col overflow-hidden">
        <PrivateHeaderDesktop />
        <PrivateHeaderMobile />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
};
