"use client";

import { en } from "./dictionaries/en";
import { bn } from "./dictionaries/bn";
import type { Dictionary } from "./types";
import { LOCALE_COOKIE, defaultLocale, isActiveLocale, type ActiveLocale } from "@/config/i18n";

export function useDictionary(): Dictionary {
  const readLocaleFromCookie = () => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === LOCALE_COOKIE) {
        return value;
      }
    }
    return null;
  };

  const initialLocale = (() => {
    const localeCookie = readLocaleFromCookie();
    return isActiveLocale(localeCookie || undefined) ? (localeCookie as ActiveLocale) : defaultLocale;
  })();

  // Return the appropriate dictionary based on initial locale
  // If cookie changes, user needs to reload for dictionary to update
  const dictionary = initialLocale === "bn" ? bn : en;

  return dictionary;
}