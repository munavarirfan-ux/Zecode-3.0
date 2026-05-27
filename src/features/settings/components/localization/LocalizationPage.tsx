"use client";

import { Download, Search, Upload } from "lucide-react";
import { HeroActionButton } from "@/components/hiring/HeroActionButton";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  settingsAccentBgActive,
  settingsField,
  settingsPanel,
} from "../../settingsTokens";
import { useRole } from "@/context/RoleContext";
import { isPlatformSuperAdmin } from "../../settingsAccess";
import {
  buildAllLanguageStates,
  LOCALIZATION_CATEGORIES,
  LOCALIZATION_LANGUAGES,
} from "../../mock/localizationData";
import type { LocalizationCategory, LocalizationEntry, LocalizationFilter } from "../../settingsTypes";
import { SettingsGate } from "../SettingsGate";
import { SettingsPageHeader } from "../SettingsPageHeader";
import { SettingsHeroLanguageSelect } from "../SettingsHeroLanguageSelect";
import { ImportTranslationsModal } from "./ImportTranslationsModal";
import { LocalizationPreview } from "./LocalizationPreview";
import { LocalizationSaveBar } from "./LocalizationSaveBar";

const FILTER_TABS: { id: LocalizationFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "modified", label: "Modified" },
  { id: "missing", label: "Missing" },
  { id: "completed", label: "Completed" },
];

function entryState(entry: LocalizationEntry): LocalizationFilter {
  const missing = !entry.value.trim();
  const modified = entry.value !== entry.defaultValue;
  if (missing) return "missing";
  if (modified) return "modified";
  return "completed";
}

export function LocalizationPage() {
  const { selectedRole } = useRole();
  const [language, setLanguage] = useState("en");
  const [category, setCategory] = useState<LocalizationCategory>("sidebar");
  const [filter, setFilter] = useState<LocalizationFilter>("all");
  const [search, setSearch] = useState("");
  const [byLanguage, setByLanguage] = useState(buildAllLanguageStates);
  const [baselineByLanguage, setBaselineByLanguage] = useState(buildAllLanguageStates);

  const data = byLanguage[language] ?? byLanguage.en;
  const baseline = baselineByLanguage[language] ?? baselineByLanguage.en;

  const setData = useCallback(
    (updater: (prev: typeof data) => typeof data) => {
      setByLanguage((all) => ({
        ...all,
        [language]: updater(all[language] ?? all.en),
      }));
    },
    [language],
  );
  const [importOpen, setImportOpen] = useState(false);
  const allowed = isPlatformSuperAdmin(selectedRole);

  const entries = data[category];

  const changeCount = useMemo(() => {
    let n = 0;
    for (const cat of Object.keys(data) as LocalizationCategory[]) {
      for (const entry of data[cat]) {
        const base = baseline[cat]?.find((b) => b.key === entry.key);
        if (base && entry.value !== base.value) n++;
      }
    }
    return n;
  }, [data, baseline]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const state = entryState(entry);
      if (filter !== "all" && state !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !entry.key.toLowerCase().includes(q) &&
          !entry.label.toLowerCase().includes(q) &&
          !entry.value.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [entries, filter, search]);

  const updateEntry = useCallback(
    (key: string, value: string) => {
      setData((prev) => ({
        ...prev,
        [category]: prev[category].map((e) => (e.key === key ? { ...e, value } : e)),
      }));
    },
    [category, setData],
  );

  const handleLanguageChange = (nextLang: string) => {
    setLanguage(nextLang);
    setCategory("sidebar");
    setFilter("all");
    setSearch("");
  };

  const discard = () => {
    setByLanguage((all) => ({
      ...all,
      [language]: structuredClone(baseline),
    }));
    toast.message("Changes discarded");
  };

  const save = () => {
    setBaselineByLanguage((all) => ({
      ...all,
      [language]: structuredClone(data),
    }));
    toast.success(`Translations saved · ${LOCALIZATION_LANGUAGES.find((l) => l.id === language)?.label ?? language}`);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zecode-translations-${language}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export downloaded");
  };

  const categoryMeta = LOCALIZATION_CATEGORIES.find((c) => c.id === category)!;

  const heroActions = (
    <>
      <SettingsHeroLanguageSelect value={language} onValueChange={handleLanguageChange} />
      <HeroActionButton type="button" onClick={() => setImportOpen(true)}>
        <Upload className="h-3.5 w-3.5" />
        Import
      </HeroActionButton>
      <HeroActionButton type="button" onClick={handleExport}>
        <Download className="h-3.5 w-3.5" />
        Export
      </HeroActionButton>
      <HeroActionButton
        type="button"
        variant="primary"
        onClick={save}
        disabled={changeCount === 0}
      >
        Save changes
      </HeroActionButton>
    </>
  );

  if (!allowed) {
    return <SettingsGate title="Localization is restricted to Super Admins" />;
  }

  return (
    <div className={cn("space-y-4", changeCount > 0 && "pb-20")}>
      <SettingsPageHeader
        scope="platform"
        scopeLabel="Platform · Super Admin only"
        title="Localization"
        description="Manage product copy, navigation labels, regional formats, and language variants."
        action={<div className="flex flex-wrap items-center gap-2">{heroActions}</div>}
      />

      <div className="flex gap-1 overflow-x-auto border-b border-[rgba(15,23,42,0.06)] pb-px dark:border-white/[0.06]">
        {LOCALIZATION_CATEGORIES.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategory(tab.id)}
            className={cn(
              "shrink-0 rounded-t-[10px] px-3 py-2 text-[12px] font-medium transition-colors",
              category === tab.id
                ? "border-b-2 border-accent text-accent"
                : "text-muted hover:text-text",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search content key or value…"
                className="h-9 w-full rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white/90 pl-9 pr-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-accent/20 dark:bg-white/[0.04]"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium",
                    filter === tab.id
                      ? cn(settingsAccentBgActive, "text-accent")
                      : "text-muted hover:bg-[rgba(15,23,42,0.04)]",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredEntries.length === 0 ? (
              <div className={cn(settingsPanel, "p-8 text-center text-[13px] text-muted")}>
                No keys match your search or filter.
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <LocalizationRow
                  key={entry.key}
                  entry={entry}
                  baselineValue={baseline[category].find((b) => b.key === entry.key)?.value ?? ""}
                  onChange={(v) => updateEntry(entry.key, v)}
                />
              ))
            )}
          </div>
        </div>

        <div className="w-full shrink-0 lg:w-[240px]">
          <LocalizationPreview entries={entries} categoryLabel={categoryMeta.label} />
        </div>
      </div>

      <LocalizationSaveBar changeCount={changeCount} onDiscard={discard} onSave={save} />
      <ImportTranslationsModal
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={() => toast.success("Import queued for review")}
      />
    </div>
  );
}

function LocalizationRow({
  entry,
  baselineValue,
  onChange,
}: {
  entry: LocalizationEntry;
  baselineValue: string;
  onChange: (value: string) => void;
}) {
  const missing = !entry.value.trim();
  const modified = entry.value !== baselineValue;

  return (
    <div
      className={cn(
        settingsPanel,
        "grid gap-3 p-4 sm:grid-cols-2 sm:items-start",
      )}
    >
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold text-text">{entry.label}</span>
          {missing ? (
            <span className="rounded-full border border-amber-400/30 bg-amber-50/80 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
              Missing translation
            </span>
          ) : modified ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              Modified
            </span>
          ) : null}
        </div>
        <p className="font-mono text-[11px] text-muted">{entry.key}</p>
        {entry.helper ? <p className="text-[11px] text-text-secondary/75">{entry.helper}</p> : null}
      </div>
      <div className="space-y-1">
        <label className="sr-only">Translation for {entry.label}</label>
        <input
          type="text"
          value={entry.value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={entry.defaultValue}
          className={cn(
            settingsField,
            missing && "border-amber-400/40",
          )}
        />
      </div>
    </div>
  );
}
