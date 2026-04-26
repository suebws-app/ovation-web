"use client";

import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@ovation/ui/components/Sidebar";
import { Link } from "@/i18n/navigation";

type SidebarNavItemProps = {
  item: {
    label: string;
    href: string;
    icon: React.ComponentType<{ width?: number; height?: number }>;
    badge?: number;
  };
  isActive: boolean;
};

export const SidebarNavItem = ({ item, isActive }: SidebarNavItemProps) => (
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
