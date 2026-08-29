const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Persists a preference in the browser for a year. Client-side only. */
export function writePreferenceCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}
