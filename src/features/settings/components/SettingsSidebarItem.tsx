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
      "rounded-10 type-body-small flex cursor-pointer items-center gap-2.5 px-3 py-2.5 font-medium transition-colors",
      active &&
        !warn &&
        "border-primary bg-primary/10 text-primary border-l-3 pl-2.5 font-semibold",
      active &&
        warn &&
        "border-destructive bg-destructive/10 text-destructive border-l-3 pl-2.5 font-semibold",
      !active && !warn && "text-foreground hover:bg-muted",
      !active && warn && "text-destructive hover:bg-destructive/5",
    )}
  >
    <Icon width={16} height={16} />
    {label}
  </button>
);
