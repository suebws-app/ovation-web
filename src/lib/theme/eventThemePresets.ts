export type EventThemePresetId =
  | "blush"
  | "red"
  | "deep_orange"
  | "orange"
  | "amber"
  | "light_green"
  | "green"
  | "teal"
  | "cyan"
  | "light_blue"
  | "blue"
  | "indigo"
  | "deep_purple"
  | "purple"
  | "brown"
  | "blue_grey"
  | "grey"
  | "black";

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
  /** Overrides the base primary L (defaults to the historical brand L). */
  primaryL?: number;
  /** Overrides the base primary C (defaults to the historical brand C). */
  primaryC?: number;
};

/**
 * Curated event theme presets. Blush is the brand pink primary; the remaining
 * palette mirrors Crisp's Material Design chatbox colors. Each preset provides
 * an exact OKLCH primary (`primaryL` / `primaryC`) so the swatch matches the
 * canonical Material 500 hex, while `scaleFor` keeps generating consistent
 * hover / active / subtle / soft variants around that hue.
 */
export const EVENT_THEME_PRESETS: EventThemePreset[] = [
  {
    id: "blush",
    nameKey: "theme__preset__blush",
    baseHex: "#F11D64",
    hue: 10.35,
    chromaMul: 1,
    primaryL: 0.6202,
    primaryC: 0.2366,
  },
  {
    id: "red",
    nameKey: "theme__preset__red",
    baseHex: "#F44336",
    hue: 28.81,
    chromaMul: 1,
    primaryL: 0.6427,
    primaryC: 0.2153,
  },
  {
    id: "deep_orange",
    nameKey: "theme__preset__deep_orange",
    baseHex: "#FF5722",
    hue: 36.53,
    chromaMul: 1,
    primaryL: 0.6792,
    primaryC: 0.2128,
  },
  {
    id: "orange",
    nameKey: "theme__preset__orange",
    baseHex: "#FF9800",
    hue: 64.05,
    chromaMul: 1,
    primaryL: 0.7703,
    primaryC: 0.1741,
  },
  {
    id: "amber",
    nameKey: "theme__preset__amber",
    baseHex: "#FFC107",
    hue: 84.93,
    chromaMul: 1,
    primaryL: 0.8442,
    primaryC: 0.1722,
  },
  {
    id: "light_green",
    nameKey: "theme__preset__light_green",
    baseHex: "#8BC34A",
    hue: 130.5,
    chromaMul: 1,
    primaryL: 0.7536,
    primaryC: 0.1626,
  },
  {
    id: "green",
    nameKey: "theme__preset__green",
    baseHex: "#4CAF50",
    hue: 144.21,
    chromaMul: 1,
    primaryL: 0.6731,
    primaryC: 0.1624,
  },
  {
    id: "teal",
    nameKey: "theme__preset__teal",
    baseHex: "#009688",
    hue: 183.38,
    chromaMul: 1,
    primaryL: 0.6045,
    primaryC: 0.1074,
  },
  {
    id: "cyan",
    nameKey: "theme__preset__cyan",
    baseHex: "#00BCD4",
    hue: 210.82,
    chromaMul: 1,
    primaryL: 0.7291,
    primaryC: 0.1265,
  },
  {
    id: "light_blue",
    nameKey: "theme__preset__light_blue",
    baseHex: "#03A9F4",
    hue: 238.99,
    chromaMul: 1,
    primaryL: 0.6991,
    primaryC: 0.157,
  },
  {
    id: "blue",
    nameKey: "theme__preset__blue",
    baseHex: "#2196F3",
    hue: 248.81,
    chromaMul: 1,
    primaryL: 0.6582,
    primaryC: 0.169,
  },
  {
    id: "indigo",
    nameKey: "theme__preset__indigo",
    baseHex: "#3F51B5",
    hue: 271.4,
    chromaMul: 1,
    primaryL: 0.4782,
    primaryC: 0.1589,
  },
  {
    id: "deep_purple",
    nameKey: "theme__preset__deep_purple",
    baseHex: "#673AB7",
    hue: 294.78,
    chromaMul: 1,
    primaryL: 0.4742,
    primaryC: 0.1862,
  },
  {
    id: "purple",
    nameKey: "theme__preset__purple",
    baseHex: "#9C27B0",
    hue: 321.24,
    chromaMul: 1,
    primaryL: 0.5168,
    primaryC: 0.2151,
  },
  {
    id: "brown",
    nameKey: "theme__preset__brown",
    baseHex: "#795548",
    hue: 40.69,
    chromaMul: 1,
    primaryL: 0.4845,
    primaryC: 0.0525,
  },
  {
    id: "blue_grey",
    nameKey: "theme__preset__blue_grey",
    baseHex: "#607D8B",
    hue: 229.02,
    chromaMul: 1,
    primaryL: 0.5724,
    primaryC: 0.0397,
  },
  {
    id: "grey",
    nameKey: "theme__preset__grey",
    baseHex: "#9E9E9E",
    hue: 0,
    chromaMul: 0,
    primaryL: 0.6993,
    primaryC: 0,
  },
  {
    id: "black",
    nameKey: "theme__preset__black",
    baseHex: "#212121",
    hue: 0,
    chromaMul: 0,
    primaryL: 0.2478,
    primaryC: 0,
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
  primaryL = 0.735,
  primaryC = 0.163,
): { light: ThemeScale; dark: ThemeScale } => ({
  light: {
    primary: `oklch(${lum(primaryL, deep)} ${chroma(primaryC, mul)} ${hue})`,
    primaryHover: `oklch(${lum(0.68, deep)} ${chroma(0.185, mul)} ${hue})`,
    primaryActive: `oklch(${lum(0.615, deep)} ${chroma(0.205, mul)} ${hue})`,
    primarySubtle: `oklch(0.955 ${chroma(0.03, mul)} ${hue})`,
    primarySoft: `oklch(0.865 ${chroma(0.09, mul)} ${hue})`,
    primaryForeground: "oklch(1 0 0)",
  },
  dark: {
    primary: `oklch(${primaryL} ${chroma(primaryC, mul)} ${hue})`,
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
  corporate: "blush",
  memorial: "blush",
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
  const { light, dark } = scaleFor(
    preset.hue,
    preset.chromaMul,
    preset.deep,
    preset.primaryL,
    preset.primaryC,
  );
  return (
    `:root{${themeVars(light)};--sidebar-accent-foreground:${light.primaryActive}}` +
    `.dark{${themeVars(dark)}}`
  );
};
