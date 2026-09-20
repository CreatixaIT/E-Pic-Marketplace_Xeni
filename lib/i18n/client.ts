"use client";

import { useState, useEffect } from "react";
import { en } from "./dictionaries/en";
import { bn } from "./dictionaries/bn";
import type { Dictionary } from "./types";
import { LOCALE_COOKIE, defaultLocale, isActiveLocale, type ActiveLocale } from "@/config/i18n";

export function useDictionary(): Dictionary {
  const [locale, setLocale] = useState<ActiveLocale>(defaultLocale);

  useEffect(() => {
    // Read locale from cookie on client side
    const readLocaleFromCookie = () => {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === LOCALE_COOKIE) {
          return value;
        }
      }
      return null;
    };

    const localeCookie = readLocaleFromCookie();
    const validLocale = isActiveLocale(localeCookie || undefined) ? (localeCookie as ActiveLocale) : defaultLocale;
    setLocale(validLocale);
  }, []);

  // Return the appropriate dictionary
  if (locale === "bn") {
    return bn;
  }
  return en;
}