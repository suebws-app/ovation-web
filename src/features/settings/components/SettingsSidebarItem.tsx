"use client";

import { cn } from "@ovation/ui/utils/cn";

type SettingsSidebarItemProps = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  active: boolean;
  warn?: boolean;
  onClick?: () => void;
};

export const SettingsSidebarItem = ({
  label,
  icon: Icon,
  active,
  warn,
  onClick,
}: SettingsSidebarItemProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex cursor-pointer items-center gap-2.5 rounded-10 px-3 py-2.5 type-body-small font-medium transition-colors",
      active && !warn && "border-l-3 border-primary bg-primary/10 pl-2.5 font-semibold text-primary",
      active && warn && "border-l-3 border-destructive bg-destructive/10 pl-2.5 font-semibold text-destructive",
      !active && !warn && "text-foreground hover:bg-muted",
      !active && warn && "text-destructive hover:bg-destructive/5",
    )}
  >
    <Icon width={16} height={16} />
    {label}
  </button>
);
