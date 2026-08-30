"use client";

import { en } from "./dictionaries/en";
import type { Dictionary } from "./types";

export function useDictionary(): Dictionary {
  // For now, we'll use English as the default
  // In a full implementation, this would read from a client-side context
  // or use the browser's language preference
  return en;
}