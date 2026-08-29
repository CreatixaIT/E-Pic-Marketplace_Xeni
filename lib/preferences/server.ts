import { cookies } from "next/headers";
import {
  LOCALE_COOKIE,
  defaultLocale,
  directionOf,
  isActiveLocale,
  type ActiveLocale,
} from "@/config/i18n";
import { THEME_COOKIE, defaultTheme, isThemeId, type ThemeId } from "@/config/themes";
import { getDictionary } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/types";

export type Preferences = {
  theme: ThemeId;
  locale: ActiveLocale;
  dir: "ltr" | "rtl";
  dictionary: Dictionary;
};

/**
 * Shopper preferences are stored in cookies rather than localStorage so the
 * server renders the chosen theme and language directly — no theme flash and
 * no hydration mismatch. Reading them opts routes into dynamic rendering.
 */
export async function getPreferences(): Promise<Preferences> {
  const store = await cookies();
  const themeCookie = store.get(THEME_COOKIE)?.value;
  const localeCookie = store.get(LOCALE_COOKIE)?.value;

  const theme = isThemeId(themeCookie) ? themeCookie : defaultTheme;
  const locale = isActiveLocale(localeCookie) ? localeCookie : defaultLocale;

  return {
    theme,
    locale,
    dir: directionOf(locale),
    dictionary: getDictionary(locale),
  };
}
