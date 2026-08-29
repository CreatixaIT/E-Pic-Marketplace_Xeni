import { defaultLocale, intlTagOf, type Locale } from "@/config/i18n";
import type { Money } from "@/lib/commerce/types";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatMoney(
  money: Money | { amount: number; currency: string },
  locale: Locale = defaultLocale,
): string {
  return new Intl.NumberFormat(intlTagOf(locale), {
    style: "currency",
    currency: money.currency as Money["currency"],
  }).format(money.amount / 100);
}
