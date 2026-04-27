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
} from "@ovation/ui/components/Sidebar";
import { Logo } from "@ovation/ui/components/Logo";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { User } from "@/lib/api/types";
import { SidebarNavItem } from "./SidebarNavItem";
import { NavUser } from "./NavUser";
import { Home } from "@ovation/icons/Home";
import { MessageSquare } from "@ovation/icons/MessageSquare";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { Star } from "@ovation/icons/Star";
import { Settings } from "@ovation/icons/Settings";
import { QrCode } from "@ovation/icons/QrCode";
import { Monitor } from "@ovation/icons/Monitor";
import { UserPlus } from "@ovation/icons/UserPlus";
import { HelpCircle } from "@ovation/icons/HelpCircle";
import { Users } from "@ovation/icons/Users";

type PrivateSideBarProps = {
  user: User;
};

export const PrivateSideBar = ({ user }: PrivateSideBarProps) => {
  const t = useTranslations();
  const pathname = usePathname();

  const navItems = [
    { label: t("sidebar__nav__home"), href: "/app", icon: Home },
    {
      label: t("sidebar__nav__messages"),
      href: "/app/messages",
      icon: MessageSquare,
      badge: 12,
    },
    { label: t("sidebar__nav__photos"), href: "/app/photos", icon: ImageIcon },
    { label: t("sidebar__nav__keepsakes"), href: "/app/keepsakes", icon: Star },
    {
      label: t("sidebar__nav__guests"),
      href: "/app/guests",
      icon: Users,
      badge: 112,
    },
    {
      label: t("sidebar__nav__settings"),
      href: "/app/settings",
      icon: Settings,
    },
  ];

  const quickLinks = [
    { label: t("sidebar__quick__qr"), href: "/app/qr-code", icon: QrCode },
    { label: t("sidebar__quick__kiosk"), href: "/app/kiosk", icon: Monitor },
    {
      label: t("sidebar__quick__invite"),
      href: "/app/invite",
      icon: UserPlus,
    },
    { label: t("sidebar__quick__help"), href: "/help", icon: HelpCircle },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-5 pt-7 pb-0">
        <Logo />
      </SidebarHeader>

      <SidebarContent className="px-1.5">
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isActive={pathname.startsWith(item.href)}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar__quick__title")}</SidebarGroupLabel>
          <SidebarMenu>
            {quickLinks.map((item) => (
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

      <SidebarFooter className="border-sidebar-border border-t">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};
