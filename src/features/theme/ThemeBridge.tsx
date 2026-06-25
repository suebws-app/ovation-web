"use client";

import { useEffect, useRef } from "react";
import {
  useThemeStore,
  type ThemePreference,
} from "@ovation/ui/utils/useThemeStore";
import { profileClient } from "@/lib/api/profile-client";

type ThemeBridgeProps = {
  initialTheme: ThemePreference | null;
};

export const ThemeBridge = ({ initialTheme }: ThemeBridgeProps) => {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const lastSyncedRef = useRef<ThemePreference | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    if (initialTheme && initialTheme !== theme) {
      setTheme(initialTheme);
      lastSyncedRef.current = initialTheme;
      return;
    }

    lastSyncedRef.current = theme;
    if (!initialTheme) {
      profileClient.updateProfile({ theme }).catch(() => {});
    }
  }, [initialTheme, theme, setTheme]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (lastSyncedRef.current === theme) return;
    lastSyncedRef.current = theme;
    profileClient.updateProfile({ theme }).catch(() => {});
  }, [theme]);

  return null;
};
