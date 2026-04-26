"use client";

import { useTranslations } from "next-intl";
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

type SettingsSidebarProps = {
  active: string;
  onNavigate?: (key: string) => void;
  coupleName: string;
  slug: string | null;
};

export const SettingsSidebar = ({
  active,
  onNavigate,
  coupleName,
  slug,
}: SettingsSidebarProps) => {
  const t = useTranslations();
  const NAV = [
    { key: "profile", labelKey: "settings__sidebar__profile", icon: User },
    { key: "link", labelKey: "settings__sidebar__link", icon: LinkIcon },
    {
      key: "branding",
      labelKey: "settings__sidebar__branding",
      icon: Swatch,
    },
    { key: "access", labelKey: "settings__sidebar__access", icon: People },
    { key: "privacy", labelKey: "settings__sidebar__privacy", icon: Lock },
    { key: "notif", labelKey: "settings__sidebar__notifications", icon: Bell },
    {
      key: "billing",
      labelKey: "settings__sidebar__billing",
      icon: CreditCard,
    },
    { key: "data", labelKey: "settings__sidebar__data", icon: Box },
    {
      key: "danger",
      labelKey: "settings__sidebar__danger",
      icon: Warning,
      warn: true,
    },
  ];

  return (
    <div className="flex flex-col gap-0.5">
      <span className="type-overline text-muted-foreground px-3 pb-3.5">
        {t("settings__sidebar__settings")}
      </span>
      {NAV.map((item) => (
        <SettingsSidebarItem
          key={item.key}
          label={t(item.labelKey)}
          icon={item.icon}
          active={active === item.key}
          warn={item.warn}
          onClick={() => onNavigate?.(item.key)}
        />
      ))}
      <div className="rounded-12 border-border bg-background mt-8 border p-3.5">
        <span className="type-overline text-muted-foreground">
          {t("settings__sidebar__your_book")}
        </span>
        <div className="type-body mt-1.5 font-serif font-semibold italic">
          {coupleName}
        </div>
        {slug && (
          <div className="type-caption text-muted-foreground mt-1 font-mono">
            ovation.love/{slug}
          </div>
        )}
      </div>
    </div>
  );
};
