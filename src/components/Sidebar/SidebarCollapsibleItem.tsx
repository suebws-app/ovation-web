"use client";

import { useState } from "react";
import { Collapsible } from "radix-ui";
import { cn } from "@ovation/ui/utils/cn";
import { ChevronDownIcon } from "@ovation/icons/ChevronDownIcon";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ovation/ui/components/Sidebar";
import { usePathname } from "@/i18n/navigation";
import { setCookie } from "@/lib/utils/cookies";
import { SidebarItem } from "./SidebarItem";
import { itemKey, collapsibleCookieName } from "./utils";
import type { SidebarNavItem } from "./types";

type SidebarCollapsibleItemProps = {
  item: SidebarNavItem;
  activeKey: string | null;
  initialOpenByCookie?: Record<string, boolean>;
};

export const SidebarCollapsibleItem = ({
  item,
  activeKey,
  initialOpenByCookie,
}: SidebarCollapsibleItemProps) => {
  const { label, icon: Icon, children = [] } = item;
  const pathname = usePathname();
  const isChildActive = children.some(
    (child) => itemKey(child) === activeKey || pathname.startsWith(child.href),
  );

  // Open by default; the persisted state comes from a cookie the server already
  // read, so SSR and the first client render agree (no open-then-close flash).
  const cookieName = collapsibleCookieName(item);
  const [open, setOpen] = useState(initialOpenByCookie?.[cookieName] ?? true);
  // Animate only after the user toggles — the initial render (from the cookie)
  // must not play the expand/collapse animation on reload.
  const [animate, setAnimate] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setAnimate(true);
    setOpen(next);
    // Session cookie (no maxAge): resets to the default (open) once the browser
    // session ends.
    setCookie(cookieName, next ? "1" : "0");
  };

  return (
    <SidebarMenuItem>
      <Collapsible.Root
        open={open}
        onOpenChange={handleOpenChange}
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
        <Collapsible.Content
          className={cn(
            "overflow-hidden",
            animate &&
              "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
          )}
        >
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
