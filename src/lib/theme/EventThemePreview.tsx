"use client";

import { buildEventThemeCss } from "./eventThemePresets";

type EventThemePreviewProps = {
  themeColor?: string | null;
  eventType?: string | null;
};

/**
 * Client-side live preview of a theme color. Rendered inside the settings form,
 * it emits the theme CSS for the currently-selected (unsaved) color. Because it
 * renders after the server-injected scope in DOM order, it wins — so picking a
 * swatch recolors the whole app immediately. Nothing is persisted; navigating
 * away re-renders the saved color server-side and the preview disappears.
 */
export const EventThemePreview = ({
  themeColor,
  eventType,
}: EventThemePreviewProps) => (
  <style>{buildEventThemeCss({ themeColor, eventType })}</style>
);
