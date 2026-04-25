"use client";

import { cn } from "@ovation/ui/utils/cn";
import { User } from "@ovation/icons/User";
import { LinkIcon } from "@ovation/icons/LinkIcon";
import { Swatch } from "@ovation/icons/Swatch";
import { People } from "@ovation/icons/People";
import { Lock } from "@ovation/icons/Lock";
import { Bell } from "@ovation/icons/Bell";
import { CreditCard } from "@ovation/icons/CreditCard";
import { Box } from "@ovation/icons/Box";
import { Warning } from "@ovation/icons/Warning";
import { SettingsSidebarItem } from "./SettingsSidebarItem";

const NAV = [
  { key: "profile", label: "Profile", icon: User },
  { key: "link", label: "Your link", icon: LinkIcon },
  { key: "branding", label: "Cover & branding", icon: Swatch },
  { key: "access", label: "Co-owners & access", icon: People },
  { key: "privacy", label: "Privacy", icon: Lock },
  { key: "notif", label: "Notifications", icon: Bell },
  { key: "billing", label: "Plan & billing", icon: CreditCard },
  { key: "data", label: "Data & export", icon: Box },
  { key: "danger", label: "Danger zone", icon: Warning, warn: true },
];

type SettingsSidebarProps = {
  active: string;
  onNavigate?: (key: string) => void;
};

export const SettingsSidebar = ({
  active,
  onNavigate,
}: SettingsSidebarProps) => {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="type-overline text-muted-foreground px-3 pb-3.5">
        Settings
      </span>
      {NAV.map((item) => (
        <SettingsSidebarItem
          key={item.key}
          label={item.label}
          icon={item.icon}
          active={active === item.key}
          warn={item.warn}
          onClick={() => onNavigate?.(item.key)}
        />
      ))}
      <div className="rounded-12 border-border bg-background mt-8 border p-3.5">
        <span className="type-overline text-muted-foreground">Your book</span>
        <div className="type-body mt-1.5 font-serif font-semibold italic">
          Lena &amp; Tom&aacute;s
        </div>
        <div className="type-caption text-muted-foreground mt-1 font-mono">
          ovation.love/lena-and-tomas
        </div>
      </div>
    </div>
  );
};
