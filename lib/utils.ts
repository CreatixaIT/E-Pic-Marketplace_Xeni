import { defaultLocale, intlTagOf, type Locale } from "@/config/i18n";
import type { Money } from "@/lib/commerce/types";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatMoney(
  { amount, currency }: Money,
  locale: Locale = defaultLocale,
): string {
  return new Intl.NumberFormat(intlTagOf(locale), {
    style: "currency",
    currency,
  }).format(amount / 100);
}
