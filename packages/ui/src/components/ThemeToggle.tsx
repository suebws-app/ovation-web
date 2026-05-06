"use client";

import { useSyncExternalStore } from "react";
import { Sun } from "@ovation/icons/Sun";
import { Moon } from "@ovation/icons/Moon";
import { useThemeStore } from "../utils/useThemeStore";
import { cn } from "../utils/cn";

const subscribe = () => () => {};
const getMountedSnapshot = () => true;
const getMountedServerSnapshot = () => false;

export const ThemeToggle = ({ className }: { className?: string }) => {
  const theme = useThemeStore((s) => s.theme);
  const cycleTheme = useThemeStore((s) => s.cycleTheme);
  const mounted = useSyncExternalStore(
    subscribe,
    getMountedSnapshot,
    getMountedServerSnapshot,
  );

  if (!mounted) {
    return (
      <button
        className={cn(
          "text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-10 items-center justify-center rounded-lg transition",
          className,
        )}
        aria-label="Toggle theme"
      >
        <span className="size-5" />
      </button>
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-10 items-center justify-center rounded-lg transition",
        className,
      )}
      aria-label={`Current theme: ${theme}. Click to switch.`}
    >
      {theme === "light" && <Sun className="size-5" />}
      {theme === "dark" && <Moon className="size-5" />}
    </button>
  );
};
