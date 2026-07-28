"use client";

import { Collapsible } from "radix-ui";
import { ChevronDownIcon } from "@ovation/icons/ChevronDownIcon";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ovation/ui/components/Sidebar";
import { usePathname } from "@/i18n/navigation";
import { SidebarItem } from "./SidebarItem";
import { itemKey } from "./utils";
import type { SidebarNavItem } from "./types";

type SidebarCollapsibleItemProps = {
  item: SidebarNavItem;
  activeKey: string | null;
};

export const SidebarCollapsibleItem = ({
  item,
  activeKey,
}: SidebarCollapsibleItemProps) => {
  const { label, icon: Icon, children = [] } = item;
  const pathname = usePathname();
  const isChildActive = children.some(
    (child) => itemKey(child) === activeKey || pathname.startsWith(child.href),
  );

  return (
    <SidebarMenuItem>
      <Collapsible.Root
        defaultOpen={isChildActive}
        className="group/collapsible"
      >
        <Collapsible.Trigger asChild>
          <SidebarMenuButton isActive={isChildActive}>
            {Icon ? <Icon width={20} height={20} /> : null}
            <span className="flex-1 text-left">{label}</span>
            <ChevronDownIcon
              width={16}
              height={16}
              className="ml-auto shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180"
            />
          </SidebarMenuButton>
        </Collapsible.Trigger>
        <Collapsible.Content className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
          <SidebarMenu className="border-sidebar-border mt-1 ml-4 gap-0.5 border-l pl-2">
            {children.map((child) => (
              <SidebarItem
                key={itemKey(child)}
                item={child}
                active={itemKey(child) === activeKey}
              />
            ))}
          </SidebarMenu>
        </Collapsible.Content>
      </Collapsible.Root>
    </SidebarMenuItem>
  );
};
