"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { hiringHeroFocusRing, hiringTransition } from "@/components/hiring/hiringTokens";

import { LOCALIZATION_LANGUAGES } from "../constants/localizationLanguages";

export type SettingsLanguageOption = { id: string; label: string };

const heroSelectTrigger = cn(
  "h-9 w-auto min-w-[8.5rem] gap-2 rounded-[11px] border border-white/[0.22]",
  "bg-white/[0.14] px-3 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
  "backdrop-blur-sm",
  "hover:border-white/[0.3] hover:bg-white/[0.22]",
  hiringHeroFocusRing,
  hiringTransition,
  "[&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0 [&_svg]:text-white/85",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-0",
);

export function SettingsHeroLanguageSelect({
  value,
  onValueChange,
  languages = LOCALIZATION_LANGUAGES,
}: {
  value: string;
  onValueChange: (value: string) => void;
  languages?: readonly SettingsLanguageOption[];
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={heroSelectTrigger} aria-label="Language">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent align="end" className="min-w-[10rem]">
        {languages.map((lang) => (
          <SelectItem key={lang.id} value={lang.id} className="text-[13px]">
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
