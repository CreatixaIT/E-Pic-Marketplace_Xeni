/**
 * Language configuration. `active` locales ship translations today; the rest
 * are declared so routing, direction handling and the selector are already
 * shaped for them when their dictionaries land.
 */
export const localeIds = ["en", "bn", "ms", "zh", "ur", "ar"] as const;

export type Locale = (typeof localeIds)[number];

/** Locales with a complete dictionary in `lib/i18n/dictionaries`. */
export type ActiveLocale = Extract<Locale, "en" | "bn">;

export const activeLocales: ActiveLocale[] = ["en", "bn"];

export const defaultLocale: ActiveLocale = "en";

export const LOCALE_COOKIE = "epic-locale";

export type LocaleConfig = {
  /** English name, used in code and tooling. */
  name: string;
  /** Name in the language itself, used in the UI. */
  nativeName: string;
  dir: "ltr" | "rtl";
  /** BCP 47 tag handed to `Intl` for number, currency and date formatting. */
  intlTag: string;
  active: boolean;
};

export const locales: Record<Locale, LocaleConfig> = {
  en: {
    name: "English",
    nativeName: "English",
    dir: "ltr",
    intlTag: "en-US",
    active: true,
  },
  bn: {
    name: "Bangla",
    nativeName: "বাংলা",
    dir: "ltr",
    intlTag: "bn-BD",
    active: true,
  },
  ms: {
    name: "Malay",
    nativeName: "Bahasa Melayu",
    dir: "ltr",
    intlTag: "ms-MY",
    active: false,
  },
  zh: {
    name: "Chinese",
    nativeName: "中文",
    dir: "ltr",
    intlTag: "zh-CN",
    active: false,
  },
  ur: {
    name: "Urdu",
    nativeName: "اردو",
    dir: "rtl",
    intlTag: "ur-PK",
    active: false,
  },
  ar: {
    name: "Arabic",
    nativeName: "العربية",
    dir: "rtl",
    intlTag: "ar-AE",
    active: false,
  },
};

export function isActiveLocale(value: string | undefined): value is ActiveLocale {
  return activeLocales.includes(value as ActiveLocale);
}

export function directionOf(locale: Locale): "ltr" | "rtl" {
  return locales[locale].dir;
}

export function intlTagOf(locale: Locale): string {
  return locales[locale].intlTag;
}
