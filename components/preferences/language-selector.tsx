"use client";

import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import {
  LOCALE_COOKIE,
  activeLocales,
  locales,
  type ActiveLocale,
} from "@/config/i18n";
import { Dropdown, type DropdownOption } from "@/components/ui/dropdown";
import { writePreferenceCookie } from "@/lib/preferences/client";

const options: DropdownOption<ActiveLocale>[] = activeLocales.map((id) => ({
  value: id,
  label: locales[id].nativeName,
}));

export function LanguageSelector({
  locale,
  label,
}: {
  locale: ActiveLocale;
  label: string;
}) {
  const router = useRouter();

  const select = (next: ActiveLocale) => {
    writePreferenceCookie(LOCALE_COOKIE, next);
    router.refresh();
  };

  return (
    <Dropdown
      label={label}
      value={locale}
      options={options}
      onSelect={select}
      trigger={<Languages className="size-4" aria-hidden />}
    />
  );
}
