"use client";

import { cn } from "@ovation/ui/utils/cn";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  useSidebar,
} from "@ovation/ui/components/Sidebar";
import { PrefetchLink } from "@/components/PrefetchLink";
import type { SidebarNavItem } from "./types";

type SidebarItemProps = {
  item: SidebarNavItem;
  active: boolean;
};

export const SidebarItem = ({ item, active }: SidebarItemProps) => {
  const { label, href, icon: Icon, badge, variant = "default" } = item;
  const warn = variant === "warn";
  const { isMobile, setOpenMobile } = useSidebar();

  const handleClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <SidebarMenuItem>
      {badge != null ? <SidebarMenuBadge>{badge}</SidebarMenuBadge> : null}
      <SidebarMenuButton
        asChild
        isActive={active}
        className={cn(
          warn &&
            "text-destructive hover:bg-destructive/10 hover:text-destructive data-[active=true]:bg-destructive/10 data-[active=true]:text-destructive",
        )}
      >
        <PrefetchLink href={href} onClick={handleClick}>
          {Icon ? <Icon width={20} height={20} /> : null}
          <span>{label}</span>
        </PrefetchLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
