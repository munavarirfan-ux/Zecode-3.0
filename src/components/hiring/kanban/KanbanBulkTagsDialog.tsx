"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getCandidateEditProfile,
  saveCandidateTags,
  SUGGESTED_TAGS,
} from "@/lib/hiring/candidateProfile";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";

export function KanbanBulkTagsDialog({
  open,
  onOpenChange,
  candidates,
  job,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: HiringCandidate[];
  job: HiringJob;
  onSaved?: () => void;
}) {
  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTags([]);
    setInput("");
    setSaving(false);
  }, [open]);

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (!t || tags.includes(t)) return;
    setTags((prev) => [...prev, t]);
    setInput("");
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  function handleSave() {
    if (tags.length === 0) {
      toast.error("Add at least one tag");
      return;
    }
    setSaving(true);
    let updated = 0;
    for (const candidate of candidates) {
      const profile = getCandidateEditProfile(candidate, job);
      const merged = [...new Set([...profile.application.tags, ...tags])];
      const result = saveCandidateTags(candidate.id, merged, candidate, job);
      if (result) updated += 1;
    }
    setSaving(false);
    if (updated === 0) {
      toast.error("Could not update tags");
      return;
    }
    toast.success(`Tags added to ${updated} candidate${updated === 1 ? "" : "s"}`);
    onSaved?.();
    onOpenChange(false);
  }

  const count = candidates.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[1.0625rem] font-semibold tracking-[-0.02em]">
            Add tags to {count} candidate{count === 1 ? "" : "s"}
          </DialogTitle>
          <DialogDescription className="text-[13px]">
            Tags will be applied to all selected candidates (merged with existing tags per profile).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-text"
              >
                {tag}
                <button
                  type="button"
                  className="rounded-full p-0.5 hover:bg-surface-2"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3 text-muted" />
                </button>
              </span>
            ))}
            {tags.length === 0 ? (
              <p className="text-[12px] text-muted">No tags added yet.</p>
            ) : null}
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a tag and press Enter"
              className="h-8 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(input);
                }
              }}
            />
            <Button type="button" size="sm" className="h-8 shrink-0" onClick={() => addTag(input)}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
              <button
                key={tag}
                type="button"
                className={cn(
                  "rounded-full border border-border-subtle px-2 py-0.5 text-[10px] font-medium text-muted",
                  "hover:border-border-default hover:text-text",
                )}
                onClick={() => addTag(tag)}
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving || tags.length === 0}>
            {saving ? "Saving…" : `Apply to ${count}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
