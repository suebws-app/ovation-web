"use client";

import { useTranslations } from "next-intl";
import {
  ThemeToggle as ThemeToggleBase,
  type ThemeToggleLabels,
} from "@ovation/ui/components/ThemeToggle";

type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const t = useTranslations();
  const labels: ThemeToggleLabels = {
    light: t("common__theme__light"),
    dark: t("common__theme__dark"),
    system: t("common__theme__system"),
    ariaLabel: t("common__theme__label"),
  };
  return <ThemeToggleBase className={className} labels={labels} />;
};
