"use client";

import { useState } from "react";
import { LogOutIcon } from "@ovation/icons/LogOutIcon";
import { ChevronsUpDownIcon } from "@ovation/icons/ChevronsUpDownIcon";
import { SettingsIcon as SettingsIcon } from "@ovation/icons/SettingsIcon";
import { StarIcon } from "@ovation/icons/StarIcon";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@ovation/ui/components/Sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ovation/ui/components/DropdownMenu";
import { Avatar, AvatarFallback } from "@ovation/ui/components/Avatar";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { signOut } from "@/lib/auth/client";
import type { User } from "@/lib/api/types";
import { displayName, initialsOf } from "@/lib/utils/userFormatters";

type NavUserProps = {
  user: User;
};

export const NavUser = ({ user }: NavUserProps) => {
  const t = useTranslations();
  const { isMobile } = useSidebar();
  const [signingOut, setSigningOut] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      window.location.replace(appRoutes.auth.signIn);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar size="sm">
                <AvatarFallback className="type-caption font-semibold">
                  {initialsOf(user)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="type-body-small truncate font-semibold">
                  {displayName(user)}
                </span>
                <span className="type-caption text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5">
                <Avatar size="sm">
                  <AvatarFallback className="type-caption font-semibold">
                    {initialsOf(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="type-body-small truncate font-semibold">
                    {displayName(user)}
                  </span>
                  <span className="type-caption text-muted-foreground truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={appRoutes.app.settings}>
                  <SettingsIcon />
                  {t("nav_user__settings")}
                </Link>
              </DropdownMenuItem>

              {user.planTier !== "free" ? (
                <DropdownMenuItem asChild>
                  <Link href={appRoutes.settings.billing}>
                    <StarIcon />
                    {t("nav_user__subscription")}
                  </Link>
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault();
                void handleSignOut();
              }}
              disabled={signingOut}
            >
              <LogOutIcon />
              {signingOut ? t("nav_user__signing_out") : t("nav_user__log_out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
