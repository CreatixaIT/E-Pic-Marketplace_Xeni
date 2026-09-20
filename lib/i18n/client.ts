"use client";

import { cookies } from "next/headers";
import { en } from "./dictionaries/en";
import { bn } from "./dictionaries/bn";
import type { Dictionary } from "./types";
import { LOCALE_COOKIE, defaultLocale, isActiveLocale } from "@/config/i18n";

export function useDictionary(): Dictionary {
  // Read locale from cookie
  const cookieStore = cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  
  // Validate and use the locale, fallback to default
  const locale = isActiveLocale(localeCookie) ? localeCookie : defaultLocale;
  
  // Return the appropriate dictionary
  if (locale === "bn") {
    return bn;
  }
  return en;
}