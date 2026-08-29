/**
 * Customer interface themes. These are the shopper's own preference and are
 * unrelated to a vendor's storefront theme (`StoreTheme` in the commerce layer).
 *
 * Colour values live in `app/globals.css` as `[data-theme="…"]` token blocks;
 * this file only carries the identity and the selector swatch.
 */
export const themeIds = [
  "midnight",
  "pearl",
  "ocean",
  "forest",
  "sunset",
] as const;

export type ThemeId = (typeof themeIds)[number];

export const defaultTheme: ThemeId = "midnight";

export const THEME_COOKIE = "epic-theme";

export const themes: Record<ThemeId, { label: string; swatch: string }> = {
  midnight: { label: "Midnight", swatch: "from-slate-900 to-violet-700" },
  pearl: { label: "Pearl", swatch: "from-zinc-100 to-zinc-400" },
  ocean: { label: "Ocean", swatch: "from-sky-900 to-cyan-500" },
  forest: { label: "Forest", swatch: "from-emerald-900 to-emerald-400" },
  sunset: { label: "Sunset", swatch: "from-rose-900 to-orange-400" },
};

export function isThemeId(value: string | undefined): value is ThemeId {
  return themeIds.includes(value as ThemeId);
}
