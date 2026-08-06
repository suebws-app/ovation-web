export type EventThemePresetId =
  | "blush"
  | "navy"
  | "sage"
  | "terracotta"
  | "amber"
  | "emerald"
  | "teal"
  | "plum"
  | "rosewood"
  | "slate"
  | "aubergine"
  | "forest"
  | "wine"
  | "midnight"
  | "espresso"
  | "pine"
  | "rust"
  | "royal"
  | "crimson"
  | "graphite";

export type EventThemePreset = {
  id: EventThemePresetId;
  nameKey: string;
  /** Stored in event.themeColor and used as the swatch identity. */
  baseHex: string;
  /** oklch hue (degrees) for the generated primary scale. */
  hue: number;
  /** Chroma multiplier applied to the pink scale's chroma pattern. */
  chromaMul: number;
  /** Lightness drop (light mode) for deeper/darker presets. Default 0. */
  deep?: number;
};

/**
 * Curated event theme presets. Each generates a full primary scale (light +
 * dark) from the brand pink's L/C pattern with its own hue and chroma. Blush is
 * the existing brand pink; Navy suits organizations, Sage suits memorials.
 */
export const EVENT_THEME_PRESETS: EventThemePreset[] = [
  {
    id: "blush",
    nameKey: "theme__preset__blush",
    baseHex: "#FF78AC",
    hue: 10,
    chromaMul: 1,
  },
  {
    id: "navy",
    nameKey: "theme__preset__navy",
    baseHex: "#5566C2",
    hue: 264,
    chromaMul: 0.7,
  },
  {
    id: "sage",
    nameKey: "theme__preset__sage",
    baseHex: "#8FA98C",
    hue: 150,
    chromaMul: 0.35,
  },
  {
    id: "terracotta",
    nameKey: "theme__preset__terracotta",
    baseHex: "#D97757",
    hue: 40,
    chromaMul: 0.9,
  },
  {
    id: "amber",
    nameKey: "theme__preset__amber",
    baseHex: "#E0A83A",
    hue: 78,
    chromaMul: 0.95,
  },
  {
    id: "emerald",
    nameKey: "theme__preset__emerald",
    baseHex: "#2FA37A",
    hue: 160,
    chromaMul: 0.9,
  },
  {
    id: "teal",
    nameKey: "theme__preset__teal",
    baseHex: "#2E9DB0",
    hue: 205,
    chromaMul: 0.85,
  },
  {
    id: "plum",
    nameKey: "theme__preset__plum",
    baseHex: "#9B6FC9",
    hue: 305,
    chromaMul: 0.8,
  },
  {
    id: "rosewood",
    nameKey: "theme__preset__rosewood",
    baseHex: "#B04A63",
    hue: 12,
    chromaMul: 0.85,
  },
  {
    id: "slate",
    nameKey: "theme__preset__slate",
    baseHex: "#6E7A8F",
    hue: 250,
    chromaMul: 0.35,
  },
  {
    id: "aubergine",
    nameKey: "theme__preset__aubergine",
    baseHex: "#6B3A6E",
    hue: 320,
    chromaMul: 0.7,
    deep: 0.13,
  },
  {
    id: "forest",
    nameKey: "theme__preset__forest",
    baseHex: "#1F7A4D",
    hue: 155,
    chromaMul: 0.85,
    deep: 0.14,
  },
  {
    id: "wine",
    nameKey: "theme__preset__wine",
    baseHex: "#8E2F44",
    hue: 8,
    chromaMul: 0.8,
    deep: 0.15,
  },
  {
    id: "midnight",
    nameKey: "theme__preset__midnight",
    baseHex: "#33408C",
    hue: 255,
    chromaMul: 0.75,
    deep: 0.15,
  },
  {
    id: "espresso",
    nameKey: "theme__preset__espresso",
    baseHex: "#6B5638",
    hue: 55,
    chromaMul: 0.5,
    deep: 0.15,
  },
  {
    id: "pine",
    nameKey: "theme__preset__pine",
    baseHex: "#1E7A82",
    hue: 190,
    chromaMul: 0.7,
    deep: 0.14,
  },
  {
    id: "rust",
    nameKey: "theme__preset__rust",
    baseHex: "#B0512A",
    hue: 35,
    chromaMul: 0.85,
    deep: 0.13,
  },
  {
    id: "royal",
    nameKey: "theme__preset__royal",
    baseHex: "#6E3AAD",
    hue: 292,
    chromaMul: 0.85,
    deep: 0.12,
  },
  {
    id: "crimson",
    nameKey: "theme__preset__crimson",
    baseHex: "#B02A44",
    hue: 2,
    chromaMul: 0.9,
    deep: 0.12,
  },
  {
    id: "graphite",
    nameKey: "theme__preset__graphite",
    baseHex: "#4A5568",
    hue: 250,
    chromaMul: 0.2,
    deep: 0.15,
  },
];

export type ThemeScale = {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primarySubtle: string;
  primarySoft: string;
  primaryForeground: string;
};

const chroma = (base: number, mul: number): number =>
  Math.round(base * mul * 1000) / 1000;

const lum = (base: number, deep: number): number =>
  Math.round((base - deep) * 1000) / 1000;

/**
 * The light + dark primary scale for a hue/chroma, mirroring the hand-authored
 * brand-pink scale in globals.css (same L/C per token, swapped hue). `deep`
 * darkens the light-mode CTA colors (primary/hover/active) for richer presets;
 * dark mode keeps its brightness for contrast on dark backgrounds.
 */
export const scaleFor = (
  hue: number,
  mul: number,
  deep = 0,
): { light: ThemeScale; dark: ThemeScale } => ({
  light: {
    primary: `oklch(${lum(0.735, deep)} ${chroma(0.163, mul)} ${hue})`,
    primaryHover: `oklch(${lum(0.68, deep)} ${chroma(0.185, mul)} ${hue})`,
    primaryActive: `oklch(${lum(0.615, deep)} ${chroma(0.205, mul)} ${hue})`,
    primarySubtle: `oklch(0.955 ${chroma(0.03, mul)} ${hue})`,
    primarySoft: `oklch(0.865 ${chroma(0.09, mul)} ${hue})`,
    primaryForeground: "oklch(1 0 0)",
  },
  dark: {
    primary: `oklch(0.735 ${chroma(0.163, mul)} ${hue})`,
    primaryHover: `oklch(0.795 ${chroma(0.135, mul)} ${hue})`,
    primaryActive: `oklch(0.68 ${chroma(0.185, mul)} ${hue})`,
    primarySubtle: `oklch(0.34 ${chroma(0.06, mul)} ${hue})`,
    primarySoft: `oklch(0.4 ${chroma(0.08, mul)} ${hue})`,
    primaryForeground: "oklch(1 0 0)",
  },
});

/** Sensible default preset per event type. Unlisted types fall back to blush. */
export const DEFAULT_PRESET_BY_TYPE: Record<string, EventThemePresetId> = {
  wedding: "blush",
  birthday: "blush",
  anniversary: "blush",
  baby_shower: "blush",
  graduation: "blush",
  other: "blush",
  corporate: "navy",
  memorial: "sage",
};

export const getPresetById = (
  id: string | null | undefined,
): EventThemePreset =>
  EVENT_THEME_PRESETS.find((p) => p.id === id) ?? EVENT_THEME_PRESETS[0];

/**
 * The preset for an event: matches its stored themeColor to a preset, else
 * falls back to the event type's default (so undated/legacy events show a
 * type-appropriate color without any backend change).
 */
export const resolveEventThemePreset = (event: {
  themeColor?: string | null;
  eventType?: string | null;
}): EventThemePreset => {
  const hex = event.themeColor?.toLowerCase();
  const byHex = hex
    ? EVENT_THEME_PRESETS.find((p) => p.baseHex.toLowerCase() === hex)
    : undefined;
  if (byHex) return byHex;
  const fallbackId = DEFAULT_PRESET_BY_TYPE[event.eventType ?? ""] ?? "blush";
  return getPresetById(fallbackId);
};

const themeVars = (scale: ThemeScale): string =>
  [
    `--primary:${scale.primary}`,
    `--primary-hover:${scale.primaryHover}`,
    `--primary-active:${scale.primaryActive}`,
    `--primary-subtle:${scale.primarySubtle}`,
    `--primary-soft:${scale.primarySoft}`,
    `--primary-foreground:${scale.primaryForeground}`,
    `--chart-1:${scale.primary}`,
    `--sidebar-primary:${scale.primary}`,
  ].join(";");

/**
 * The global CSS that recolors the primary token scale to an event's theme
 * preset (light + dark), plus the light-mode active-sidebar-item text token.
 * Shared by the server-rendered scope and the client-side live preview.
 */
export const buildEventThemeCss = (event: {
  themeColor?: string | null;
  eventType?: string | null;
}): string => {
  const preset = resolveEventThemePreset(event);
  const { light, dark } = scaleFor(preset.hue, preset.chromaMul, preset.deep);
  return (
    `:root{${themeVars(light)};--sidebar-accent-foreground:${light.primaryActive}}` +
    `.dark{${themeVars(dark)}}`
  );
};
