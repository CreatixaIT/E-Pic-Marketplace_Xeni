"use client";

import { useRouter } from "next/navigation";
import { Palette } from "lucide-react";
import { THEME_COOKIE, themeIds, themes, type ThemeId } from "@/config/themes";
import { Dropdown, type DropdownOption } from "@/components/ui/dropdown";
import { writePreferenceCookie } from "@/lib/preferences/client";

const options: DropdownOption<ThemeId>[] = themeIds.map((id) => ({
  value: id,
  label: themes[id].label,
  swatch: themes[id].swatch,
}));

export function ThemeSelector({
  theme,
  label,
}: {
  theme: ThemeId;
  label: string;
}) {
  const router = useRouter();

  const select = (next: ThemeId) => {
    writePreferenceCookie(THEME_COOKIE, next);
    // Apply immediately, then let the server re-render with the new cookie.
    document.documentElement.dataset.theme = next;
    router.refresh();
  };

  return (
    <Dropdown
      label={label}
      value={theme}
      options={options}
      onSelect={select}
      trigger={<Palette className="size-4" aria-hidden />}
    />
  );
}
