"use client";

import { useSyncExternalStore } from "react";
import { SunIcon } from "@ovation/icons/SunIcon";
import { MoonIcon } from "@ovation/icons/MoonIcon";
import { MonitorIcon } from "@ovation/icons/MonitorIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { useThemeStore, type ThemePreference } from "../utils/useThemeStore";
import { cn } from "../utils/cn";

const subscribe = () => () => {};
const getMountedSnapshot = () => true;
const getMountedServerSnapshot = () => false;

export type ThemeToggleLabels = {
  light: string;
  dark: string;
  system: string;
  ariaLabel?: string;
};

const DEFAULT_LABELS: ThemeToggleLabels = {
  light: "Light",
  dark: "Dark",
  system: "System",
  ariaLabel: "Toggle theme",
};

const ICONS: Record<
  ThemePreference,
  typeof SunIcon | typeof MoonIcon | typeof MonitorIcon
> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
};

type ThemeToggleProps = {
  className?: string;
  labels?: ThemeToggleLabels;
};

export const ThemeToggle = ({
  className,
  labels = DEFAULT_LABELS,
}: ThemeToggleProps) => {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const mounted = useSyncExternalStore(
    subscribe,
    getMountedSnapshot,
    getMountedServerSnapshot,
  );

  const triggerClass = cn(
    "text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition",
    className,
  );

  if (!mounted) {
    return (
      <button className={triggerClass} aria-label={labels.ariaLabel}>
        <span className="size-4" />
      </button>
    );
  }

  const CurrentIcon = ICONS[theme];

  const options: Array<{ value: ThemePreference; label: string }> = [
    { value: "light", label: labels.light },
    { value: "dark", label: labels.dark },
    { value: "system", label: labels.system },
  ];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className={triggerClass} aria-label={labels.ariaLabel}>
          <CurrentIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {options.map(({ value, label }) => {
          const Icon = ICONS[value];
          return (
            <DropdownMenuItem
              key={value}
              onSelect={() => setTheme(value)}
              className="cursor-pointer"
            >
              <Icon className="size-4" />
              <span className="flex-1">{label}</span>
              {theme === value && (
                <CheckIcon className="text-foreground size-4" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
