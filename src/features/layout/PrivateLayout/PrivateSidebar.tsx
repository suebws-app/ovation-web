"use client";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroupLabel,
  SidebarMenuBadge,
} from "@ovation/ui/components/Sidebar";
import { Logo } from "@ovation/ui/components/Logo";
import { Avatar } from "@ovation/ui/components/Avatar";
import { Link, usePathname } from "@/i18n/navigation";
import { Home } from "@ovation/icons/Home";
import { MessageSquare } from "@ovation/icons/MessageSquare";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { Star } from "@ovation/icons/Star";
import { Settings } from "@ovation/icons/Settings";
import { QrCode } from "@ovation/icons/QrCode";
import { Monitor } from "@ovation/icons/Monitor";
import { UserPlus } from "@ovation/icons/UserPlus";
import { HelpCircle } from "@ovation/icons/HelpCircle";

const NAV_ITEMS = [
  { label: "Home", href: "/app", icon: Home },
  { label: "Messages", href: "/app/messages", icon: MessageSquare, badge: 12 },
  { label: "Photos", href: "/app/photos", icon: ImageIcon },
  { label: "Keepsakes", href: "/app/keepsakes", icon: Star },
  { label: "Settings", href: "/app/settings", icon: Settings },
];

const QUICK_LINKS = [
  { label: "QR code", href: "/app/qr-code", icon: QrCode },
  { label: "Kiosk mode", href: "/app/kiosk", icon: Monitor },
  { label: "Invite guests", href: "/app/invite", icon: UserPlus },
  { label: "Help center", href: "/help", icon: HelpCircle },
];

export const PrivateSideBar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="px-5 pb-0 pt-7">
        <Logo />
      </SidebarHeader>

      <SidebarContent className="px-1.5">
        <SidebarGroup>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={pathname.startsWith(item.href)}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Quick links</SidebarGroupLabel>
          <SidebarMenu>
            {QUICK_LINKS.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild size="sm">
                  <Link href={item.href}>
                    <item.icon width={17} height={17} />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar initials="L&T" tint="#EFC9A8" size="md" />
          <span className="type-body-small font-semibold text-foreground">
            Lena & Tomás
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

type NavItemProps = {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
};

const NavItem = ({ item, isActive }: NavItemProps) => (
  <SidebarMenuItem>
    {item.badge != null && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={item.href}>
        <item.icon width={20} height={20} />
        <span>{item.label}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);
