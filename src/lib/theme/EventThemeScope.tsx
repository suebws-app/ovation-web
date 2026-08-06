import type { ReactNode } from "react";
import { buildEventThemeCss } from "./eventThemePresets";

type EventThemeScopeProps = {
  event: { themeColor?: string | null; eventType?: string | null };
  children: ReactNode;
};

/**
 * Recolors the primary/accent token scale to the event's theme preset for the
 * WHOLE document (light + dark), so every surface — including shared chrome like
 * the sidebar that renders outside this subtree — follows the event's color
 * instead of the static brand pink. The <style> overrides the globals
 * `:root`/`.dark` tokens globally; it comes after globals.css in source order,
 * so equal-specificity rules win. Only event-scoped pages render it.
 */
export const EventThemeScope = ({ event, children }: EventThemeScopeProps) => (
  <>
    <style>{buildEventThemeCss(event)}</style>
    {children}
  </>
);
