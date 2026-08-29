import type { ActiveLocale } from "@/config/i18n";
import { defaultLocale } from "@/config/i18n";
import { bn } from "./dictionaries/bn";
import { en } from "./dictionaries/en";
import type { Dictionary } from "./types";

const dictionaries: Record<ActiveLocale, Dictionary> = { en, bn };

export function getDictionary(locale: ActiveLocale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/**
 * Fills `{name}` placeholders. Deliberately tiny — no ICU plurals until a
 * locale actually needs them.
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary } from "./types";
