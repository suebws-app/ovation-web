import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeState = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
  cycleTheme: () => void;
};

const CYCLE_ORDER: ThemePreference[] = ["light", "dark", "system"];
const THEME_COOKIE = "ovation_theme";
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const matchSystemDark = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const resolveTheme = (theme: ThemePreference): ResolvedTheme => {
  if (theme === "system") return matchSystemDark() ? "dark" : "light";
  return theme;
};

const applyThemeToDOM = (resolved: ResolvedTheme) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", resolved === "dark");
};

const writeThemeCookie = (theme: ThemePreference) => {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? ";secure" : "";
  document.cookie = `${THEME_COOKIE}=${theme};path=/;max-age=${THEME_COOKIE_MAX_AGE};samesite=lax${secure}`;
};

let systemListenerAttached = false;

const attachSystemListener = (
  get: () => ThemeState,
  set: (partial: Partial<ThemeState>) => void,
) => {
  if (systemListenerAttached || typeof window === "undefined") return;
  systemListenerAttached = true;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", () => {
    if (get().theme !== "system") return;
    const resolved: ResolvedTheme = media.matches ? "dark" : "light";
    set({ resolvedTheme: resolved });
    applyThemeToDOM(resolved);
  });
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      resolvedTheme: "light",

      setTheme: (theme) => {
        const resolved = resolveTheme(theme);
        set({ theme, resolvedTheme: resolved });
        applyThemeToDOM(resolved);
        writeThemeCookie(theme);
        attachSystemListener(get, set);
      },

      cycleTheme: () => {
        const currentIndex = CYCLE_ORDER.indexOf(get().theme);
        const nextTheme = CYCLE_ORDER[(currentIndex + 1) % CYCLE_ORDER.length];
        get().setTheme(nextTheme);
      },
    }),
    {
      name: "theme",
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return;
        const resolved = resolveTheme(state.theme);
        state.resolvedTheme = resolved;
        applyThemeToDOM(resolved);
        writeThemeCookie(state.theme);
        attachSystemListener(
          () => useThemeStore.getState(),
          (partial) => useThemeStore.setState(partial),
        );
      },
    },
  ),
);
